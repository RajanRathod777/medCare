const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// 🔌 Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Optional: disable SQL logging
  }
);

// ✅ Article Category Model
const ArticleCategory = sequelize.define(
  "ArticleCategory",
  {
    categoryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    categoryName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "article_categorys",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// ✅ Article Model
const Article = sequelize.define(
  "Article",
  {
    articleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ArticleCategory,
        key: "categoryId",
      },
    },
    publishDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    topicName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bestTopic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bestArticle: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "articles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// ✅ Article Summary Model
const ArticleSummary = sequelize.define(
  "ArticleSummary",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Article,
        key: "articleId",
      },
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sectionTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "article_summaries",
    timestamps: false,
  }
);

// ✅ Associations

// Category -> Article (when category is deleted, delete all its articles)
ArticleCategory.hasMany(Article, {
  foreignKey: "categoryId",
  as: "articles",
  onDelete: "CASCADE",
  hooks: true, // 🔥 Required for CASCADE to work in Sequelize
});
Article.belongsTo(ArticleCategory, {
  foreignKey: "categoryId",
  as: "category",
});

// Article -> ArticleSummary (when article is deleted, delete all its summaries)
Article.hasMany(ArticleSummary, {
  foreignKey: "articleId",
  as: "summaries",
  onDelete: "CASCADE",
  hooks: true, // 🔥 Required
});
ArticleSummary.belongsTo(Article, {
  foreignKey: "articleId",
  as: "article",
});

// ✅ Export all
module.exports = {
  sequelize,
  ArticleCategory,
  Article,
  ArticleSummary,
};
