// // config/query/schema.js

// const tbl_user = `CREATE TABLE IF NOT EXISTS tbl_user (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(100),
//   email VARCHAR(100) UNIQUE,
//   phone VARCHAR(15) UNIQUE,
//   gender VARCHAR(10),
//   dob DATE,
//   password VARCHAR(255),
//   role ENUM('admin', 'doctor', 'patient') DEFAULT 'patient',
//   status_flag TINYINT(1) DEFAULT 1,
//   isNotify TINYINT(1) DEFAULT 0,
//   otp VARCHAR(6),
//   otp_expire_time DATETIME,
//   isVerify TINYINT(1) DEFAULT 0,
//   create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   create_user INT,
//   update_user INT
// );`;

// const medications_reminder = `CREATE TABLE IF NOT EXISTS medications_reminder (
//   medicationReminderId INT AUTO_INCREMENT PRIMARY KEY,
//   user_id INT NOT NULL,
//   store_id INT,
//   doctor_id INT NOT NULL,
//   name VARCHAR(100) NOT NULL,
//   dosage VARCHAR(50),
//   period ENUM('Every Day', 'Every Alternate Day', 'Custom'),
//   times_per_day INT,
//   times JSON,
//   drink_rule ENUM('Before Meals', 'After Meals', 'With Meals'),
//   start_date DATE NOT NULL,
//   duration VARCHAR(20),
//   end_date DATE,
//   notes TEXT,
//   is_active BOOLEAN DEFAULT TRUE,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   FOREIGN KEY (user_id) REFERENCES tbl_user(id) ON DELETE CASCADE
// );`;

// const specialist = `CREATE TABLE IF NOT EXISTS specialist (
//   specialistId INT AUTO_INCREMENT PRIMARY KEY,
//   image VARCHAR(255),
//   specialty VARCHAR(255),
//   isActive BOOLEAN DEFAULT TRUE,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );`;

// const hospitals_normalized = `CREATE TABLE IF NOT EXISTS hospitals_normalized (
//   id VARCHAR(30) PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   logo TEXT,
//   image TEXT,
//   address TEXT NOT NULL,
//   phone VARCHAR(20),
//   phoneCode VARCHAR(5),
//   country VARCHAR(255),
//   state VARCHAR(255),
//   city VARCHAR(255),
//   locationLink TEXT,
//   latitude DECIMAL(10, 8),
//   longitude DECIMAL(11, 8),
//   zoom_level INT DEFAULT 15,
//   entrance_lat DECIMAL(10, 8),
//   entrance_lng DECIMAL(11, 8),
//   website VARCHAR(255),
//   isActive BOOLEAN DEFAULT TRUE,
//   reank INT DEFAULT 0,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );`;

// const hospital_specialties = `CREATE TABLE IF NOT EXISTS hospital_specialties (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   hospital_id VARCHAR(100),
//   doctor_id VARCHAR(255) NOT NULL DEFAULT '0',
//   specialty VARCHAR(255),
//   specialistId INT,
//   FOREIGN KEY (hospital_id) REFERENCES hospitals_normalized(id) ON DELETE CASCADE,
//   FOREIGN KEY (specialistId) REFERENCES specialist(specialistId) ON DELETE SET NULL,
//   INDEX idx_hospital_specialty (hospital_id, specialty)
// );`;

// const hospital_room_types = `CREATE TABLE IF NOT EXISTS hospital_room_types (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   hospital_id VARCHAR(100),
//   room_type VARCHAR(100),
//   totalBed INT,
//   availableBed INT,
//   description TEXT,
//   note TEXT,
//   pricePerNight DECIMAL(10, 2),
//   currency VARCHAR(3),
//   FOREIGN KEY (hospital_id) REFERENCES hospitals_normalized(id) ON DELETE CASCADE,
//   INDEX idx_hospital_room (hospital_id, room_type)
// );`;

// const articles_categorys = `CREATE TABLE IF NOT EXISTS article_categorys (
//   categoryId INT AUTO_INCREMENT PRIMARY KEY,
//   image VARCHAR(255),
//   categoryName VARCHAR(255) NOT NULL UNIQUE,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );`;

// const articles = `CREATE TABLE IF NOT EXISTS articles (
//   articleId INT AUTO_INCREMENT PRIMARY KEY,
//   image VARCHAR(255),
//   categoryId INT,
//   publishDate DATE,
//   topicName VARCHAR(255),
//   title VARCHAR(255),
//   author VARCHAR(100),
//   bestTopic BOOLEAN DEFAULT FALSE,
//   bestArticle BOOLEAN DEFAULT FALSE,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   FOREIGN KEY (categoryId) REFERENCES article_categorys(categoryId) ON DELETE SET NULL
// );`;

// const article_summaries = `CREATE TABLE IF NOT EXISTS article_summaries (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   articleId INT NOT NULL,
//   image VARCHAR(255),
//   sectionTitle VARCHAR(255),
//   content TEXT,
//   FOREIGN KEY (articleId) REFERENCES articles(articleId) ON DELETE CASCADE
// );`;

// module.exports = {
//   hospitals_normalized,
//   hospital_specialties,
//   hospital_room_types,
//   articles,
//   article_summaries,
//   articles_categorys,
//   specialist,
//   medications_reminder,
//   tbl_user,
// };








// config/query/schema.js

 
const tbl_user = `CREATE TABLE IF NOT EXISTS tbl_user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(15) UNIQUE,
  gender VARCHAR(10),
  dob DATE,
  password VARCHAR(255),
  role ENUM('admin', 'doctor', 'patient') DEFAULT 'patient',
  status_flag TINYINT(1) DEFAULT 1,
  isNotify TINYINT(1) DEFAULT 0,
  otp VARCHAR(6),
  otp_expire_time DATETIME,
  isVerify TINYINT(1) DEFAULT 0,
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  create_user INT,
  update_user INT
);`;


const medications_reminder = `CREATE TABLE IF NOT EXISTS medications_reminder (
  medicationReminderId INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT,
  doctor_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50),
  period ENUM('Every Day', 'Every Alternate Day', 'Custom'),
  times_per_day INT,
  times JSON,
  drink_rule ENUM('Before Meals', 'After Meals', 'With Meals'),
  start_date DATE NOT NULL,
  duration VARCHAR(20),
  end_date DATE,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES tbl_user(id) ON DELETE CASCADE
);`;





const specialist = `CREATE TABLE IF NOT EXISTS specialist (
  specialistId INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255),
  specialty VARCHAR(255),
  isActive BOOLEAN DEFAULT TRUE, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

const hospitals_normalized = `
  CREATE TABLE IF NOT EXISTS hospitals_normalized (
  id VARCHAR(30) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo TEXT ,
  image TEXT ,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  phoneCode VARCHAR(5),
  country VARCHAR(255),
  state VARCHAR(255),
  city VARCHAR(255),
  locationLink TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  zoom_level INT DEFAULT 15,
  entrance_lat DECIMAL(10, 8),
  entrance_lng DECIMAL(11, 8),
  website VARCHAR(255),
  isActive BOOLEAN DEFAULT TRUE,
  reank INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

const hospital_specialties = `
  CREATE TABLE IF NOT EXISTS hospital_specialties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hospital_id VARCHAR(100),
  doctor_id VARCHAR(255) NOT NULL DEFAULT '0', 
  specialty VARCHAR(255), 
  specialistId INT,
  FOREIGN KEY (hospital_id) REFERENCES hospitals_normalized(id) ON DELETE CASCADE,
  FOREIGN KEY (specialistId) REFERENCES specialist(specialistId) ON DELETE SET NULL,
  INDEX idx_hospital_specialty (hospital_id, specialty) 
);`;

const hospital_room_types = `
  CREATE TABLE IF NOT EXISTS hospital_room_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hospital_id VARCHAR(100),
  room_type VARCHAR(100),
  totalBed INT,            
  availableBed INT,       
  description TEXT,
  note TEXT,
  pricePerNight DECIMAL(10, 2),
  currency VARCHAR(3),
  FOREIGN KEY (hospital_id) REFERENCES hospitals_normalized(id) ON DELETE CASCADE,
  INDEX idx_hospital_room (hospital_id, room_type)
);`;

const articles_categorys = `CREATE TABLE IF NOT EXISTS article_categorys (
  categoryId INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255),
  categoryName VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

const articles = `CREATE TABLE IF NOT EXISTS articles (
  articleId INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255),
  categoryId INT,
  publishDate DATE,
  topicName VARCHAR(255),
  title VARCHAR(255),
  author VARCHAR(100),
  bestTopic BOOLEAN DEFAULT FALSE,
  bestArticle BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES article_categorys(categoryId) ON DELETE SET NULL
);`;

const article_summaries = `CREATE TABLE IF NOT EXISTS article_summaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  articleId INT NOT NULL,
  image VARCHAR(255),
  sectionTitle VARCHAR(255),
  content TEXT,
  FOREIGN KEY (articleId) REFERENCES articles(articleId) ON DELETE CASCADE
);`;

module.exports = {
  hospitals_normalized,
  hospital_specialties,
  hospital_room_types,
  articles,
  article_summaries,
  articles_categorys,
  specialist,
  medications_reminder,
  tbl_user,
};




