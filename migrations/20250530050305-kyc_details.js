// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('kyc_details', {
//       id: {
//         type: Sequelize.INTEGER.UNSIGNED,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       user_id: {
//         type: Sequelize.INTEGER.UNSIGNED,
//         allowNull: false,
//         references: {
//           model: 'users', // Ensure this matches your actual User table
//           key: 'id'
//         },
//         onDelete: 'CASCADE'
//       },
//       restaurant_id: {
//         type: Sequelize.INTEGER.UNSIGNED,
//         allowNull: false,
//         references: {
//           model: 'foodrestaurants', // Ensure this matches your Restaurant table
//           key: 'id'
//         },
//         onDelete: 'CASCADE'
//       },
//       bank_name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       account_holder_name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       account_number: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       ifsc_code: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       pan_name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       pan_number: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       full_address: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       gst_number: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       msme_number: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       shop_certificate_number: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       cheque: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       gst_certificate: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       msme_certificate: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       shop_certificate: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       additional_docs: {
//         type: Sequelize.JSONB,
//         allowNull: true,
//       },
     
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('kyc_details');
//   }
// };
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kyc_details', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      restaurant_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'foodrestaurants',  // double-check exact table name in DB
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_holder_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ifsc_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pan_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pan_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      full_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gst_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      msme_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shop_certificate_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cheque: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gst_certificate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      msme_certificate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shop_certificate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      additional_docs: {
        type: Sequelize.JSON,  // Use JSON instead of JSONB for MariaDB/MySQL
        allowNull: true,
      },
      created_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kyc_details');
  }
};
