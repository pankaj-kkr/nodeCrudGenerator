#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');

// Helper functions
const createFile = (dir, name, content) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, name), content);
};

const insertRouteInIndex = (filePath, routeName) => {
  const routeImport = `router.use('/${routeName}s', require('./${routeName}Routes'));\n`;
  const data = fs.readFileSync(filePath, 'utf8');
  const updatedData = data.replace(
    /module\.exports = router;/,
    `${routeImport}\nmodule.exports = router;`
  );
  fs.writeFileSync(filePath, updatedData, 'utf8');
};

const capFirst = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

// Command to create a model
program
  .command('make:model <name>')
  .description('Create a new model')
  .action((name) => {
    const content = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeDb');

const ${name} = sequelize.define(
  '${name}',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ${name};
`;
    createFile('src/models', `${name}.js`, content);
    console.log(`Model ${name} created successfully.`);
  });

program
  .command('make:models <jsonFile>')
  .description('Create models based on a JSON schema')
  .action((jsonFile) => {
    const filePath = path.resolve(jsonFile);
    if (!fs.existsSync(filePath)) {
      console.error('JSON file not found');
      return;
    }

    const modelsConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    Object.keys(modelsConfig).forEach((modelName) => {
      const model = modelsConfig[modelName];
      const attributes = model.attributes;
      const relationships = model.relationships;

      const attributesStr = Object.entries(attributes)
        .map(([key, type]) => {
          const typeMapping = {
            STRING: 'DataTypes.STRING',
            INTEGER: 'DataTypes.INTEGER',
            TEXT: 'DataTypes.TEXT',
            BOOLEAN: 'DataTypes.BOOLEAN',
            DATE: 'DataTypes.DATE',
          };
          return `    ${key}: {
      type: ${typeMapping[type]},
      allowNull: ${type === 'STRING' ? 'false' : 'true'},
    }`;
        })
        .join(',\n');

      const relationshipsStr = Object.entries(relationships)
        .map(([type, relatedModels]) => {
          return Object.entries(relatedModels)
            .map(([relatedModel, options]) => {
              if (type === 'belongsTo') {
                return `    ${modelName}.belongsTo(${relatedModel}, {
      foreignKey: '${options.foreignKey}',
    });`;
              } else if (type === 'hasMany') {
                return `    ${modelName}.hasMany(${relatedModel}, {
      foreignKey: '${options.foreignKey}',
    });`;
              }
              return '';
            })
            .join('\n');
        })
        .join('\n');

      const content = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeDb');

const ${modelName} = sequelize.define(
  '${modelName}',
  {
${attributesStr}
  },
  {
    timestamps: true,
  }
);

${relationshipsStr}

module.exports = ${modelName};
`;

      createFile('template/models', `${modelName}.js`, content);
      console.log(`Model ${modelName} created successfully.`);
    });
  });

// Command to create a controller
program
  .command('make:controller <name>')
  .description('Create a new controller')
  .action((name) => {
    const content = `const BaseController = require('./baseController');
const ${capFirst(name)} = require('../models/${capFirst(name)}');

class ${capFirst(name)}Controller extends BaseController {
  // Add any custom methods if needed
}

module.exports = new ${capFirst(name)}Controller(${capFirst(name)});
`;
    createFile('src/controllers', `${name}Controller.js`, content);
    console.log(`Controller ${name} created successfully.`);
  });

// Command to create a route
program
  .command('make:route <name>')
  .description('Create a new route')
  .action((name) => {
    const content = `const express = require('express');
const router = express.Router();
const { restrict } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const ${name}Controller = require('../controllers/${name}Controller');

router.post('/', restrict(['Admin']), asyncHandler(${name}Controller.create));
router.get('/', restrict(['Admin']), asyncHandler(${name}Controller.read));
router.get('/:id',restrict(['Admin', 'User'], true), asyncHandler(${name}Controller.readById));
router.put('/:id',restrict(['Admin', 'User'], true),asyncHandler(${name}Controller.update));
router.delete('/:id', restrict(['Admin']), asyncHandler(${name}Controller.delete));

module.exports = router;
`;
    createFile('src/routes', `${name.toLowerCase()}Routes.js`, content);
    const indexPath = path.join('src/routes', 'index.js');
    insertRouteInIndex(indexPath, name);
    console.log(indexPath);
    console.log(`Route ${name} created successfully.`);
  });

program.parse(process.argv);
