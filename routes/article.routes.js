const express = require("express");
const router = express.Router();
const {
  getArticles,
  getArticleById,
  getBestArticles,
  getBestTopics,
  deleteArticle,
  getAllCategories,
  getArticlesByCategory,
  getArticleBySearch,
  addCategories,
  deleteCategory,
  addArticle,
  updateArticle,
  updateCategory,
} = require("../controllers/article.controller");

router.get("/bast/articles", getBestArticles); // List articles
router.get("/bast_topic/articles", getBestTopics);
router.get("/article/categorys", getAllCategories);
router.get("/articles/category/:categoryId/page/:page", getArticlesByCategory);
router.get("/articles/page/:page", getArticles);
router.get("/articles/search/page/:page", getArticleBySearch);
router.get("/article/:articleId", getArticleById);


// admin
// category

router.post("/article/categorys", addCategories);
router.delete("/article/categorys/:id", deleteCategory);
router.put("/article/categorys/:id", updateCategory);

// artical
router.post("/article", addArticle);
router.put("/article/:articleId", updateArticle);
router.delete("/article/:articleId", deleteArticle);
module.exports = router;

