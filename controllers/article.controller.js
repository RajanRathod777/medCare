const {
  ArticleCategory,
  Article,
  ArticleSummary,
} = require("../models/articleModels");
const { Op } = require("sequelize");

// ✅ Get best articles
exports.getBestArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { bestArticle: true },
      attributes: ["articleId", "image", "title"],
    });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Error fetching best articles" });
  }
};

// ✅ Get best topics
exports.getBestTopics = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { bestTopic: true },
      attributes: ["articleId", "image", "topicName"],
    });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Error fetching best topic articles" });
  }
};

// ✅ Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ArticleCategory.findAll({
      attributes: ["categoryId", "image", "categoryName"],
    });

    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

// ✅ Get articles by categoryId
exports.getArticlesByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const page = parseInt(req.params.page) || 1;

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const limit = 2;
    const offset = (page - 1) * limit;

    const { count, rows } = await Article.findAndCountAll({
      where: { categoryId },
      attributes: ["articleId", "image", "title", "publishDate", "categoryId"],
      include: [
        {
          model: ArticleCategory,
          as: "category",
          attributes: ["categoryName"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    // Optional: transform data to flatten categoryName
    const articlesWithCategoryName = rows.map((article) => ({
      articleId: article.articleId,
      image: article.image,
      title: article.title,
      publishDate: article.publishDate,
      categoryId: article.categoryId,
      categoryName: article.category?.categoryName || null,
    }));

    res.json({
      currentPage: page,
      totalPages,
      articles: articlesWithCategoryName,
    });
  } catch (err) {
    console.error("Error fetching articles by category:", err);
    res.status(500).json({ error: "Error fetching articles" });
  }
};


// ✅ Get paginated articles
exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const { count, rows } = await Article.findAndCountAll({
      attributes: ["articleId", "image", "title", "categoryId", "publishDate"],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      currentPage: page,
      totalPages,
      articles: rows,
    });
  } catch (err) {
    console.error("Error fetching paginated articles:", err);
    res.status(500).json({ error: "Error fetching articles" });
  }
};

// ✅ Get article details by ID with summaries and category name
exports.getArticleById = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findOne({
      where: { articleId },
      attributes: [
        "articleId",
        "image",
        "categoryId",
        "publishDate",
        "topicName",
        "title",
        "author",
      ],
      include: [
        {
          model: ArticleCategory,
          as: "category",
          attributes: ["categoryName"],
        },
        {
          model: ArticleSummary,
          as: "summaries",
          attributes: ["image", "sectionTitle", "content"],
        },
      ],
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Optional: flatten category name
    const response = {
      ...article.toJSON(),
      categoryName: article.category?.categoryName || null,
    };
    delete response.category;

    res.json(response);
  } catch (err) {
    console.error("Error fetching article:", err);
    res.status(500).json({ error: "Error fetching article details" });
  }
};


// ✅ Search articles
exports.getArticleBySearch = async (req, res) => {
  try {
    const { search = "" } = req.body;
    const page = parseInt(req.params.page) || 1;
    const limit = 2;
    const offset = (page - 1) * limit;

    const { count, rows } = await Article.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { topicName: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
          { publishDate: { [Op.like]: `%${search}%` } },
          { "$category.categoryName$": { [Op.like]: `%${search}%` } },
        ],
      },
      include: [
        {
          model: ArticleCategory,
          as: "category",
          attributes: [],
        },
      ],
      attributes: [
        "articleId",
        "image",
        "topicName",
        "title",
        "categoryId",
        "publishDate",
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      currentPage: page,
      totalPages,
      articles: rows,
    });
  } catch (err) {
    console.error("Error searching articles:", err);
    res.status(500).json({ error: "Error searching articles" });
  }
};

// ✅ Add new category
exports.addCategories = async (req, res) => {
  try {
    const { image, categoryName } = req.body;

    if (!categoryName) {
      return res
        .status(400)
        .json({ success: false, message: "categoryName is required" });
    }

    const existing = await ArticleCategory.findOne({ where: { categoryName } });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Category already exists" });
    }

    const newCategory = await ArticleCategory.create({ image, categoryName });

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (err) {
    console.error("Error adding category:", err);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// ✅ Delete category and its related articles + summaries
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category with articles and summaries included
    const deletedCategory = await ArticleCategory.findByPk(id, {
      include: {
        model: Article,
        as: 'articles',
        include: {
          model: ArticleSummary,
          as: 'summaries',
        },
      },
    });

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // This will automatically delete all associated articles and summaries
    await deletedCategory.destroy();

    res.status(200).json({
      success: true,
      message: "Category and related articles/summaries deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, image } = req.body;

    const category = await ArticleCategory.findByPk(id);

    if (!category) {
      return res.status(201).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if categoryName is being changed and already exists
    if (categoryName && categoryName !== category.categoryName) {
      const existingCategory = await ArticleCategory.findOne({
        where: {
          categoryName: categoryName,
          categoryId: { [Op.ne]: id }, // Exclude current category
        },
      });

      if (existingCategory) {
        return res.status(201).json({
          success: false,
          message: "Category name already exists",
        });
      }
    }

    await category.update({
      categoryName: categoryName || category.categoryName,
      image: image || category.image,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};





exports.addArticle = async (req, res) => {
  try {
    const {
      image,
      categoryId,
      publishDate,
      topicName,
      title,
      author,
      bestTopic = false,
      bestArticle = false,
      summaries = [],
    } = req.body;

    // Step 1: Create the article
    const article = await Article.create({
      image,
      categoryId,
      publishDate,
      topicName,
      title,
      author,
      bestTopic,
      bestArticle,
    });

    // Step 2: Create summaries if provided
    if (Array.isArray(summaries) && summaries.length > 0) {
      const summaryData = summaries.map((summary) => ({
        articleId: article.articleId, // Use DB-generated ID
        image: summary.image,
        sectionTitle: summary.sectionTitle,
        content: summary.content,
      }));

      await ArticleSummary.bulkCreate(summaryData);
    }

    res.status(201).json({
      success: true,
      message: 'Article and summaries added successfully',
      articleId: article.articleId,
    });

  } catch (err) {
    console.error('Error adding article:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add article',
      error: err.message,
    });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    const {
      image,
      categoryId,
      publishDate,
      topicName,
      title,
      author,
      bestTopic = false,
      bestArticle = false,
      summaries = [],
    } = req.body;

    // Step 1: Find the existing article
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Step 2: Update the article fields
    await article.update({
      image,
      categoryId,
      publishDate,
      topicName,
      title,
      author,
      bestTopic,
      bestArticle,
    });

    // Step 3: Delete old summaries
    await ArticleSummary.destroy({
      where: { articleId },
    });

    // Step 4: Add new summaries
    if (Array.isArray(summaries) && summaries.length > 0) {
      const summaryData = summaries.map((summary) => ({
        articleId,
        image: summary.image,
        sectionTitle: summary.sectionTitle,
        content: summary.content,
      }));

      await ArticleSummary.bulkCreate(summaryData);
    }

    res.status(200).json({
      success: true,
      message: "Article and summaries updated successfully",
      articleId,
    });
  } catch (err) {
    console.error("Error updating article:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update article",
      error: err.message,
    });
  }
};


exports.deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    // Step 1: Find the article
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Step 2: Delete summaries (optional, because cascade can also do it)
    await ArticleSummary.destroy({
      where: { articleId },
    });

    // Step 3: Delete the article
    await article.destroy();

    res.status(200).json({
      success: true,
      message: "Article and its summaries deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete article",
      error: err.message,
    });
  }
};


    






// exports.getArticleCategorys = async (req, res) => {
//   try {
//     const articles = await Article.findAll({
//       where: { bestTopic: true },
//       attributes: ["articleId", "image", "topicName"],
//     });
//     console.log(articles);
//     res.json(articles);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching best topic articles" });
//   }
// };

// Create article with summary
// exports.createArticle = async (req, res) => {
//   try {
//     const articles = Array.isArray(req.body) ? req.body : [req.body];
//     const conn = await pool.getConnection();
//     await conn.beginTransaction();

//     // Get last articleId
//     const [[lastRow]] = await conn.execute(
//       `SELECT articleId FROM articles WHERE articleId LIKE 'ART%' ORDER BY articleId DESC LIMIT 1`
//     );

//     let nextIdNum = 1;
//     if (lastRow && lastRow.articleId) {
//       const lastNum = parseInt(lastRow.articleId.replace("ART", ""), 10);
//       if (!isNaN(lastNum)) {
//         nextIdNum = lastNum + 1;
//       }
//     }

//     const createdIds = [];

//     for (let article of articles) {
//       const articleId = `ART${String(nextIdNum++).padStart(3, "0")}`;
//       const {
//         image,
//         category,
//         publishDate,
//         title_short,
//         title_full,
//         author,
//         bestTopic,
//         bestArticle,
//         summary,
//       } = article; // ✅ fix here

//       await Article.create({
//         articleId,
//         image,
//         category,
//         publishDate,
//         title_short,
//         title_full,
//         author,
//         bestTopic,
//         bestArticle,
//       });

//       if (summary && Array.isArray(summary)) {
//         for (const item of summary) {
//           await ArticleSummary.create({
//             articleId,
//             sectionTitle: item.sectionTitle,
//             content: item.content,
//           });
//         }
//       }

//       createdIds.push(articleId); // ✅ collect created IDs
//     }

//     await conn.commit();
//     res
//       .status(201)
//       .json({ message: "Articles created", articleIds: createdIds });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create article(s)" });
//   }
// };

// exports.deleteArticle = async (req, res) => {
//   try {
//     const articleId = req.params.articleId?.trim();
//     console.log("Delete article ID =", articleId);

//     const deleted = await Article.destroy({
//       where: { articleId },
//     });

//     if (!deleted) {
//       return res.status(404).json({ message: "Article not found" });
//     }

//     res.json({ message: "Article and its summaries deleted successfully" });
//   } catch (err) {
//     console.error("Delete error:", err);
//     res.status(500).json({ error: "Error deleting article" });
//   }
// };

// exports.updateFullArticle = async (req, res) => {
//   try {
//     const { articleId } = req.params;
//     const {
//       image,
//       category,
//       publishDate,
//       title_short,
//       title_full,
//       author,
//       bestTopic,
//       bestArticle,
//       summary,
//     } = req.body;

//     // Step 1: Update the article
//     const [updatedCount] = await Article.update(
//       {
//         image,
//         category,
//         publishDate,
//         title_short,
//         title_full,
//         author,
//         bestTopic,
//         bestArticle,
//       },
//       {
//         where: { articleId },
//       }
//     );

//     if (updatedCount === 0) {
//       return res
//         .status(404)
//         .json({ message: "Article not found or unchanged" });
//     }

//     // Step 2: Delete old summaries
//     await ArticleSummary.destroy({
//       where: { articleId },
//     });

//     // Step 3: Insert new summaries
//     if (Array.isArray(summary)) {
//       const newSummaries = summary.map((item) => ({
//         articleId,
//         sectionTitle: item.sectionTitle,
//         content: item.content,
//       }));

//       await ArticleSummary.bulkCreate(newSummaries);
//     }

//     res.json({ message: "Article and summaries updated successfully" });
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({ error: "Error updating article and summaries" });
//   }
// };
