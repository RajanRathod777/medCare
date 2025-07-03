const {
  HospitalsNormalized,
  HospitalSpecialties,
  HospitalRoomTypes,
  Specialist,
} = require("../models/hospital.model");

const { Op, fn, col, where, literal } = require("sequelize");

// exports.getAllHospital = async (req, res) => {
//   try {
//     const hospitals = await HospitalsNormalized.findAll({
//       where: { isActive: true },
//       // Show ALL columns (no attributes filter)
//       include: [
//         {
//           model: HospitalSpecialties,
//           attributes: ["id", "hospital_id", "specialty", "specialistId"],
//           include: {
//             model: Specialist,
//             attributes: ["specialistId", "image", "specialty", "isActive"],
//           },
//         },
//         {
//           model: HospitalRoomTypes,
//           attributes: [
//             "id",
//             "hospital_id",
//             "room_type",
//             "totalBed",
//             "availableBed",
//             "description",
//             "note",
//             "pricePerNight",
//             "currency",
//           ],
//         },
//       ],
//     });

//     // Directly return Sequelize result with raw column names
//     res.json(hospitals);
//   } catch (err) {
//     console.error("Error fetching hospitals:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


exports.getAllHospital = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1; 
    const limit = 2;
    const offset = (page - 1) * limit;

    // Count total hospitals
    const totalHospitals = await HospitalsNormalized.count({
      where: { isActive: true },
    });

    // Fetch hospitals with pagination and associations
    const hospitals = await HospitalsNormalized.findAll({
      where: { isActive: true },
      limit,
      offset,
      attributes: {
        exclude: ["isActive", "reank", "created_at", "updated_at"],
      },
      include: [
        {
          model: HospitalSpecialties,
          attributes: ["doctor_id"],
          include: {
            model: Specialist,
            attributes: ["image", "specialty"],
          },
        },
        {
          model: HospitalRoomTypes,
          attributes: [
            "hospital_id",
            "room_type",
            "totalBed",
            "availableBed",
            "description",
            "note",
            "pricePerNight",
            "currency",
          ],
        },
      ],
    });

    const totalPages = Math.ceil(totalHospitals / limit);

    res.json({
      currentPage: page,
      totalPages,
      hospitals,
    });
  } catch (err) {
    console.error("Error fetching hospitals:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getHospitalById = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const hospital = await HospitalsNormalized.findOne({
      where: { id: hospitalId, isActive: true },
       attributes: {
        exclude: ["isActive", "reank", "created_at", "updated_at"],
      },
      include: [
        {
          model: HospitalSpecialties,
          attributes: ["id", "hospital_id", "doctor_id", "specialty", "specialistId"],
          include: {
            model: Specialist,
            attributes: ["specialistId", "image", "specialty"],
          },
        },
        {
          model: HospitalRoomTypes,
          attributes: [
            "id",
            "hospital_id",
            "room_type",
            "totalBed",
            "availableBed",
            "description",
            "note",
            "pricePerNight",
            "currency",
          ],
        },
      ],
    });

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.json(hospital);
  } catch (err) {
    console.error("Error fetching hospital by ID:", err);
    res.status(500).json({ error: err.message });
  }

};


exports.findHospitals = async (req, res) => {
  try {
   
    const { search } = req.body;
    const page = parseInt(req.params.page || 1); 
    const limit = 2;
    const offset = (page - 1) * limit;

    if (!search || search.trim() === "") {
      return res.status(400).json({ error: "Search string is required." });
    }

    const searchWords = search.trim().split(/\s+/).filter(Boolean);

    // Build OR conditions for each word
    const searchConditions = searchWords.map((word) => {
      const likePattern = `%${word.toLowerCase()}%`;

      return {
        [Op.or]: [
          where(fn("LOWER", col("HospitalsNormalized.name")), {
            [Op.like]: likePattern,
          }),
          where(fn("LOWER", col("HospitalsNormalized.city")), {
            [Op.like]: likePattern,
          }),
          where(fn("LOWER", col("HospitalsNormalized.state")), {
            [Op.like]: likePattern,
          }),
          where(fn("LOWER", col("HospitalSpecialties.specialty")), {
            [Op.like]: likePattern,
          }),
          where(fn("LOWER", col("HospitalSpecialties->Specialist.specialty")), {
            [Op.like]: likePattern,
          }),
        ],
      };
    });

    // Fetch all matched hospitals first (filtering at DB level)
    const hospitals = await HospitalsNormalized.findAll({
      where: {
        isActive: true,
        [Op.or]: searchConditions,
      },
       attributes: {
        exclude: ["isActive", "reank", "created_at", "updated_at"],
      },
      include: [
        {
          model: HospitalSpecialties,
          attributes: ["id", "hospital_id", "specialty", "specialistId"],
          include: {
            model: Specialist,
            attributes: ["specialistId", "image", "specialty", "isActive"],
          },
        },
        {
          model: HospitalRoomTypes,
          attributes: [
            "id",
            "hospital_id",
            "room_type",
            "totalBed",
            "availableBed",
            "description",
            "note",
            "pricePerNight",
            "currency",
          ],
        },
      ],
    });

    // Score hospitals based on matched words
    const scoredHospitals = hospitals.map((hospital) => {
      let text = `${hospital.name} ${hospital.city} ${hospital.state}`;
      if (hospital.HospitalSpecialties) {
        hospital.HospitalSpecialties.forEach((spec) => {
          text += ` ${spec.specialty}`;
          if (spec.Specialist) {
            text += ` ${spec.Specialist.specialty}`;
          }
        });
      }

      const lowerText = text.toLowerCase();
      const matchedWords = searchWords.filter((word) =>
        lowerText.includes(word.toLowerCase())
      );
      const matchScore = new Set(matchedWords).size;

      return { hospital, matchScore };
    });

    // Sort by score (most relevant first)
    scoredHospitals.sort((a, b) => b.matchScore - a.matchScore);

    // Paginate sorted results
    const paginatedHospitals = scoredHospitals
      .slice(offset, offset + limit)
      .map((item) => item.hospital);

    const totalPages = Math.ceil(scoredHospitals.length / limit);

    if (paginatedHospitals.length === 0) {
      return res
        .status(404)
        .json({ error: "No hospitals matched your search." });
    }

    res.json({
      totalHospitals: scoredHospitals.length,
      totalPages,
      currentPage: page,
      hospitals: paginatedHospitals,
    });
  } catch (err) {
    console.error("Error in findHospitals:", err);
    res.status(500).json({ error: err.message });
  }
};




// const addHospital = async (req, res) => {
//   const hospitals = Array.isArray(req.body) ? req.body : [req.body];

//   const conn = await pool.getConnection();
//   await conn.beginTransaction();

//   try {
//     // Get latest hospital ID (e.g., HOSP010)
//     const [[lastRow]] = await conn.execute(
//       `SELECT id FROM hospitals_normalized WHERE id LIKE 'HOSP%' ORDER BY id DESC LIMIT 1`
//     );

//     let nextIdNum = 1;
//     if (lastRow && lastRow.id) {
//       const lastNum = parseInt(lastRow.id.replace("HOSP", ""), 10);
//       nextIdNum = lastNum + 1;
//     }

//     const insertedHospitals = [];

//     for (let hospital of hospitals) {
//       const newId = `HOSP${String(nextIdNum++).padStart(3, "0")}`;

//       await conn.execute(
//         `INSERT INTO hospitals_normalized
//           (id, name, address, phone, website, latitude, longitude, zoom_level, entrance_lat, entrance_lng)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           newId,
//           hospital.name,
//           hospital.address,
//           hospital.phone || null,
//           hospital.website || null,
//           hospital.latitude || null,
//           hospital.longitude || null,
//           hospital.zoom_level || 15,
//           hospital.entrance_lat || null,
//           hospital.entrance_lng || null,
//         ]
//       );

//       const [[inserted]] = await conn.execute(
//         `SELECT id, name, address, phone FROM hospitals_normalized WHERE id = ?`,
//         [newId]
//       );

//       insertedHospitals.push(inserted);
//     }

//     await conn.commit();

//     res.status(201).json({
//       message: `${insertedHospitals.length} hospital(s) created successfully.`,
//       hospitals: insertedHospitals,
//     });
//   } catch (err) {
//     await conn.rollback();
//     res.status(500).json({ error: err.message });
//   } finally {
//     conn.release();
//   }
// };

// const addHospitalSpecialties = async (req, res) => {
//   const { hospitalId } = req.params;
//   const specialties = Array.isArray(req.body) ? req.body : [req.body];

//   try {
//     if (!Array.isArray(specialties) || specialties.length === 0) {
//       return res.status(400).json({ error: "Specialties array is required" });
//     }

//     for (const item of specialties) {
//       if (!item.specialty || typeof item.specialty !== 'string') {
//         return res.status(400).json({ error: "Each item must have a 'specialty' string" });
//       }

//       await pool.query(
//         `INSERT INTO hospital_specialties (hospital_id, specialty) VALUES (?, ?)`,
//         [hospitalId, item.specialty]
//       );
//     }

//     res.status(201).json({ message: "Specialties added successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const addHospitalRoomTypes = async (req, res) => {
//   const { hospitalId } = req.params;
//   const roomTypes = Array.isArray(req.body) ? req.body : [req.body];

//   try {
//     if (!roomTypes.length) {
//       return res.status(400).json({ error: "Room types array is required" });
//     }

//     for (const room of roomTypes) {
//       const { room_type, description, price, currency } = room;

//       if (!room_type || !price || !currency) {
//         return res.status(400).json({ error: "Each room must have room_type, price, and currency" });
//       }

//       await pool.query(
//         `INSERT INTO hospital_room_types (hospital_id, room_type, description, price, currency)
//          VALUES (?, ?, ?, ?, ?)`,
//         [hospitalId, room_type, description || '', price, currency]
//       );
//     }

//     res.status(201).json({ message: "Room types added successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
