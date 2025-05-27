export default {
  "count": 20,
  "results": [
    {
      "id": 24,
      "code": "TEST-FILTER-004",
      "name": "Available devices",
      "description": "Filter to check the device availability",
      "type": "BOOLEAN",
      "options": {},
      "query_param_filter": "on",
      "column_configuration": {
        "name": "device_availability",
        "label": "Device Availability (device_availability)",
        "type": "boolean",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "BOOLEAN": [
              "on"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 70,
        "first_name": "Vaishnavi",
        "last_name": "Akshay",
        "username": "vaishnavi.shivakumar@nagarro.com",
        "email": "vaishnavi.shivakumar@nagarro.com",
        "user_name": "Vaishnavi Akshay"
      },
      "active_countries_list": [
        196
      ]
    },
    {
      "id": 23,
      "code": "TEST FILTER-003",
      "name": "Business models",
      "description": "Test filter business models",
      "type": "BOOLEAN",
      "options": {},
      "query_param_filter": "on",
      "column_configuration": {
        "name": "sustainable_business_model",
        "label": "Sustainable Business Model (sustainable_business_model)",
        "type": "boolean",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "BOOLEAN": [
              "on"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 70,
        "first_name": "Vaishnavi",
        "last_name": "Akshay",
        "username": "vaishnavi.shivakumar@nagarro.com",
        "email": "vaishnavi.shivakumar@nagarro.com",
        "user_name": "Vaishnavi Akshay"
      },
      "active_countries_list": [
        196
      ]
    },
    {
      "id": 22,
      "code": "TEST FILTER-002",
      "name": "Male teacher count",
      "description": "Test filter for checking male teachers count",
      "type": "RANGE",
      "options": {
        "range_auto_compute": false,
        "minPlaceholder": "10",
        "maxPlaceholder": "50"
      },
      "query_param_filter": "range",
      "column_configuration": {
        "name": "num_teachers_male",
        "label": "Number of Male Teachers (num_teachers_male)",
        "type": "int",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "RANGE": [
              "range"
            ],
            "INPUT": [
              "exact"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 70,
        "first_name": "Vaishnavi",
        "last_name": "Akshay",
        "username": "vaishnavi.shivakumar@nagarro.com",
        "email": "vaishnavi.shivakumar@nagarro.com",
        "user_name": "Vaishnavi Akshay"
      },
      "active_countries_list": [
        196
      ]
    },
    {
      "id": 21,
      "code": "TEST FILTER-001",
      "name": "Education Level",
      "description": "Test filter for edu level",
      "type": "DROPDOWN_MULTISELECT",
      "options": {
        "live_choices": true
      },
      "query_param_filter": "in",
      "column_configuration": {
        "name": "education_level",
        "label": "Education Level (education_level)",
        "type": "str",
        "table_name": "schools_school",
        "table_alias": "schools",
        "table_label": "School",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "iexact",
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains",
              "icontains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 70,
        "first_name": "Vaishnavi",
        "last_name": "Akshay",
        "username": "vaishnavi.shivakumar@nagarro.com",
        "email": "vaishnavi.shivakumar@nagarro.com",
        "user_name": "Vaishnavi Akshay"
      },
      "active_countries_list": [
        3,
        4,
        5,
        6,
        7,
        8,
        11,
        13,
        15,
        21,
        24,
        25,
        26,
        27,
        29,
        31,
        32,
        35,
        43,
        44,
        45,
        46,
        48,
        49,
        50,
        52,
        53,
        54,
        86,
        87,
        124,
        125,
        126,
        127,
        128,
        132,
        134,
        136,
        137,
        138,
        139,
        144,
        145,
        148,
        149,
        152,
        154,
        155,
        156,
        164,
        167,
        169,
        171,
        172,
        173,
        174,
        175,
        176,
        182,
        184,
        185,
        187,
        190,
        191,
        192,
        193,
        195,
        196,
        197,
        198,
        200,
        201,
        203,
        205,
        207,
        209,
        214,
        216,
        222,
        224,
        229,
        230,
        234,
        238,
        239,
        240,
        241,
        249,
        250,
        252,
        255,
        258,
        263,
        264,
        267,
        268,
        269,
        276,
        279,
        285,
        288,
        296,
        297,
        299,
        304,
        311,
        317,
        321,
        329,
        331,
        332
      ]
    },
    {
      "id": 20,
      "code": "REGION",
      "name": "Region",
      "description": "Enter region",
      "type": "INPUT",
      "options": {
        "placeholder": "Enter region"
      },
      "query_param_filter": "contains",
      "column_configuration": {
        "name": "environment",
        "label": "Region (environment)",
        "type": "str",
        "table_name": "schools_school",
        "table_alias": "schools",
        "table_label": "School",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "iexact",
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains",
              "icontains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 46,
        "first_name": "Nitesh",
        "last_name": "Admin",
        "username": "nitesh02@nagarro.com",
        "email": "nitesh02@nagarro.com",
        "user_name": "Nitesh Admin"
      },
      "active_countries_list": [
        29,
        39,
        54,
        126,
        144,
        147,
        149,
        150,
        153,
        164,
        174,
        192,
        196
      ]
    },
    {
      "id": 19,
      "code": "COMPUTER_AVA",
      "name": "Computer availability",
      "description": "Enter no.",
      "type": "BOOLEAN",
      "options": {},
      "query_param_filter": "on",
      "column_configuration": {
        "name": "computer_availability",
        "label": "Computer Availability (computer_availability)",
        "type": "boolean",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "BOOLEAN": [
              "on"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 46,
        "first_name": "Nitesh",
        "last_name": "Admin",
        "username": "nitesh02@nagarro.com",
        "email": "nitesh02@nagarro.com",
        "user_name": "Nitesh Admin"
      },
      "active_countries_list": [
        196
      ]
    },
    {
      "id": 18,
      "code": "BUILDING_ID",
      "name": "Building Id",
      "description": "building id",
      "type": "INPUT",
      "options": {
        "placeholder": "Enter building id"
      },
      "query_param_filter": "contains",
      "column_configuration": {
        "name": "building_id_govt",
        "label": "Building Govt ID (building_id_govt)",
        "type": "str",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "iexact",
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains",
              "icontains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 46,
        "first_name": "Nitesh",
        "last_name": "Admin",
        "username": "nitesh02@nagarro.com",
        "email": "nitesh02@nagarro.com",
        "user_name": "Nitesh Admin"
      },
      "active_countries_list": [
        196
      ]
    },
    {
      "id": 16,
      "code": "TF-003",
      "name": "Trained teachers count",
      "description": "Filter to test the teachers count",
      "type": "BOOLEAN",
      "options": {},
      "query_param_filter": "on",
      "column_configuration": {
        "name": "teachers_trained",
        "label": "Trained Teachers (teachers_trained)",
        "type": "boolean",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "BOOLEAN": [
              "on"
            ]
          }
        }
      },
      "status": "DISABLED",
      "published_by": {
        "id": 70,
        "first_name": "Vaishnavi",
        "last_name": "Akshay",
        "username": "vaishnavi.shivakumar@nagarro.com",
        "email": "vaishnavi.shivakumar@nagarro.com",
        "user_name": "Vaishnavi Akshay"
      },
      "active_countries_list": [
        196
      ]
    },
    {
      "id": 17,
      "code": "TF-004",
      "name": "Equipment's count",
      "description": "Filter to check the equipment's count",
      "type": "RANGE",
      "options": {
        "minPlaceholder": "min(30)",
        "maxPlaceholder": "max(100)",
        "range_auto_compute": false
      },
      "query_param_filter": "range",
      "column_configuration": {
        "name": "num_robotic_equipment",
        "label": "Number of Robotic Equipment (num_robotic_equipment)",
        "type": "int",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "RANGE": [
              "range"
            ],
            "INPUT": [
              "exact"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 70,
        "first_name": "Vaishnavi",
        "last_name": "Akshay",
        "username": "vaishnavi.shivakumar@nagarro.com",
        "email": "vaishnavi.shivakumar@nagarro.com",
        "user_name": "Vaishnavi Akshay"
      },
      "active_countries_list": [
        196
      ]
    },
    {
      "id": 15,
      "code": "TF-002",
      "name": "Test connectivity",
      "description": "Filter to do smoke testing",
      "type": "DROPDOWN",
      "options": {
        "live_choices": true
      },
      "query_param_filter": "iexact",
      "column_configuration": {
        "name": "connectivity_type",
        "label": "Connectivity Type (connectivity_type)",
        "type": "str",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "iexact",
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains",
              "icontains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 70,
        "first_name": "Vaishnavi",
        "last_name": "Akshay",
        "username": "vaishnavi.shivakumar@nagarro.com",
        "email": "vaishnavi.shivakumar@nagarro.com",
        "user_name": "Vaishnavi Akshay"
      },
      "active_countries_list": [
        32,
        126,
        134,
        137,
        144,
        149,
        161,
        173,
        174,
        175,
        184,
        191,
        192,
        194,
        200,
        201,
        222,
        238,
        249,
        258,
        276,
        285,
        299,
        329,
        331,
        332
      ]
    },
    {
      "id": 14,
      "code": "TF-001",
      "name": "Building-id",
      "description": "Test filter",
      "type": "DROPDOWN_MULTISELECT",
      "options": {
        "live_choices": false,
        "choices": [
          {
            "label": "South Buildings",
            "value": "1009"
          },
          {
            "label": "North buildings",
            "value": "2001"
          },
          {
            "label": "East Buildings",
            "value": "3970"
          }
        ]
      },
      "query_param_filter": "in",
      "column_configuration": {
        "name": "building_id_govt",
        "label": "Building Govt ID (building_id_govt)",
        "type": "str",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "iexact",
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains",
              "icontains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 70,
        "first_name": "Vaishnavi",
        "last_name": "Akshay",
        "username": "vaishnavi.shivakumar@nagarro.com",
        "email": "vaishnavi.shivakumar@nagarro.com",
        "user_name": "Vaishnavi Akshay"
      },
      "active_countries_list": [
        196,
        337
      ]
    },
    {
      "id": 1,
      "code": "SCHOOL_AREA_TYPE-AUTO",
      "name": "School area type - Org",
      "description": "Urban or rural region in which school is located.",
      "type": "DROPDOWN",
      "options": {
        "live_choices": true,
        "placeholder": "Placeholder",
        "choices": [
          {
            "label": "Urban",
            "value": "urban"
          },
          {
            "label": "Rural",
            "value": "rural"
          },
          {
            "label": "Unknown",
            "value": "none"
          }
        ]
      },
      "query_param_filter": "iexact",
      "column_configuration": {
        "name": "environment",
        "label": "Region (environment)",
        "type": "str",
        "table_name": "schools_school",
        "table_alias": "schools",
        "table_label": "School",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "iexact",
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains",
              "icontains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 42,
        "first_name": "Vikash",
        "last_name": "Admin",
        "username": "vikash.kumar05@nagarro.com",
        "email": "vikash.kumar05@nagarro.com",
        "user_name": "Vikash Admin"
      },
      "active_countries_list": [
        29,
        39,
        54,
        126,
        147,
        150,
        153,
        174,
        192,
        196
      ]
    },
    {
      "id": 6,
      "code": "TEST NG-002",
      "name": "Maps views - Grouped",
      "description": "Describes the views of maps",
      "type": "DROPDOWN",
      "options": {
        "live_choices": false,
        "choices": [
          {
            "label": ">= 4G",
            "value": "4g|5g|6g"
          },
          {
            "label": ">= 1G",
            "value": "1g|2g|3g"
          },
          {
            "label": "No Internet",
            "value": "no"
          },
          {
            "label": "Unknown",
            "value": "unknown|none"
          }
        ]
      },
      "query_param_filter": "exact",
      "column_configuration": {
        "name": "coverage_type",
        "label": "Coverage Type (coverage_type)",
        "type": "str",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "iexact",
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains",
              "icontains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 42,
        "first_name": "Vikash",
        "last_name": "Admin",
        "username": "vikash.kumar05@nagarro.com",
        "email": "vikash.kumar05@nagarro.com",
        "user_name": "Vikash Admin"
      },
      "active_countries_list": [
        4,
        7,
        23,
        29,
        32,
        37,
        44,
        54,
        86,
        126,
        134,
        137,
        139,
        144,
        149,
        152,
        153,
        170,
        171,
        174,
        175,
        184,
        191,
        192,
        194,
        196,
        201,
        222,
        238,
        249,
        258,
        264,
        269,
        276,
        285,
        291,
        299,
        321,
        329,
        331,
        332
      ]
    },
    {
      "id": 3,
      "code": "EDUCATION_LEVEL",
      "name": "Education level - Org",
      "description": "Highest level of education taught at the school",
      "type": "DROPDOWN",
      "options": {
        "live_choices": false,
        "placeholder": "placeholder",
        "choices": [
          {
            "label": "Primary",
            "value": "pre-primary|primary|pre-primary, primary"
          },
          {
            "label": "Secondary",
            "value": "secondary|post-secondary|secondary and post-secondary"
          },
          {
            "label": "Unknown",
            "value": "none"
          }
        ]
      },
      "query_param_filter": "exact",
      "column_configuration": {
        "name": "education_level_lower",
        "label": "Education Level (education_level_lower)",
        "type": "str",
        "table_name": "schools_school",
        "table_alias": "schools",
        "table_label": "School",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 42,
        "first_name": "Vikash",
        "last_name": "Admin",
        "username": "vikash.kumar05@nagarro.com",
        "email": "vikash.kumar05@nagarro.com",
        "user_name": "Vikash Admin"
      },
      "active_countries_list": [
        3,
        4,
        5,
        6,
        7,
        8,
        11,
        13,
        15,
        21,
        24,
        25,
        26,
        27,
        29,
        31,
        32,
        35,
        43,
        44,
        45,
        46,
        48,
        49,
        50,
        52,
        53,
        54,
        86,
        87,
        124,
        125,
        126,
        127,
        128,
        132,
        134,
        136,
        137,
        138,
        139,
        145,
        148,
        149,
        152,
        154,
        155,
        156,
        164,
        167,
        169,
        171,
        172,
        173,
        174,
        175,
        176,
        182,
        184,
        185,
        187,
        190,
        191,
        192,
        193,
        195,
        197,
        198,
        200,
        201,
        203,
        205,
        207,
        209,
        214,
        216,
        222,
        224,
        229,
        230,
        234,
        238,
        239,
        240,
        241,
        249,
        250,
        252,
        255,
        258,
        263,
        264,
        267,
        268,
        269,
        276,
        279,
        285,
        288,
        296,
        297,
        299,
        304,
        311,
        317,
        321,
        329,
        331,
        332
      ]
    },
    {
      "id": 2,
      "code": "SCHOOL_FUNDING_SOURCE",
      "name": "School Administration - Org",
      "description": "",
      "type": "DROPDOWN",
      "options": {
        "live_choices": false,
        "placeholder": "placeholder",
        "choices": [
          {
            "label": "Private",
            "value": "private"
          },
          {
            "label": "Public",
            "value": "public"
          },
          {
            "label": "Unknown",
            "value": "none"
          }
        ]
      },
      "query_param_filter": "exact",
      "column_configuration": {
        "name": "school_type_lower",
        "label": "School Type (school_type_lower)",
        "type": "str",
        "table_name": "schools_school",
        "table_alias": "schools",
        "table_label": "School",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 42,
        "first_name": "Vikash",
        "last_name": "Admin",
        "username": "vikash.kumar05@nagarro.com",
        "email": "vikash.kumar05@nagarro.com",
        "user_name": "Vikash Admin"
      },
      "active_countries_list": [
        44,
        144,
        150,
        153,
        174,
        184,
        222,
        276,
        331
      ]
    },
    {
      "id": 13,
      "code": "BUILDING_GOVT_ID",
      "name": "Building Govt ID",
      "description": "",
      "type": "INPUT",
      "options": {
        "placeholder": "Enter govt id"
      },
      "query_param_filter": "icontains",
      "column_configuration": {
        "name": "building_id_govt",
        "label": "Building Govt ID (building_id_govt)",
        "type": "str",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "iexact",
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains",
              "icontains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 42,
        "first_name": "Vikash",
        "last_name": "Admin",
        "username": "vikash.kumar05@nagarro.com",
        "email": "vikash.kumar05@nagarro.com",
        "user_name": "Vikash Admin"
      },
      "active_countries_list": []
    },
    {
      "id": 11,
      "code": "NG009",
      "name": "No of Computer",
      "description": "",
      "type": "RANGE",
      "options": {
        "range_auto_compute": true,
        "minPlaceholder": "0",
        "maxPlaceholder": "10000"
      },
      "query_param_filter": "range",
      "column_configuration": {
        "name": "num_computers",
        "label": "Number of Computers (num_computers)",
        "type": "int",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "RANGE": [
              "range"
            ],
            "INPUT": [
              "exact"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 42,
        "first_name": "Vikash",
        "last_name": "Admin",
        "username": "vikash.kumar05@nagarro.com",
        "email": "vikash.kumar05@nagarro.com",
        "user_name": "Vikash Admin"
      },
      "active_countries_list": [
        7,
        32,
        134,
        164,
        174,
        184,
        191,
        196,
        200,
        222,
        285,
        299,
        329
      ]
    },
    {
      "id": 12,
      "code": "COVERAGE TYPE",
      "name": "Coverage Type",
      "description": "Coverage Type",
      "type": "DROPDOWN_MULTISELECT",
      "options": {
        "live_choices": true
      },
      "query_param_filter": "in",
      "column_configuration": {
        "name": "coverage_type",
        "label": "Coverage Type (coverage_type)",
        "type": "str",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "DROPDOWN": [
              "iexact",
              "exact"
            ],
            "DROPDOWN_MULTISELECT": [
              "in"
            ],
            "INPUT": [
              "contains",
              "icontains"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 42,
        "first_name": "Vikash",
        "last_name": "Admin",
        "username": "vikash.kumar05@nagarro.com",
        "email": "vikash.kumar05@nagarro.com",
        "user_name": "Vikash Admin"
      },
      "active_countries_list": [
        4,
        7,
        23,
        29,
        32,
        37,
        44,
        54,
        86,
        126,
        134,
        137,
        139,
        149,
        152,
        153,
        170,
        171,
        174,
        175,
        184,
        191,
        192,
        194,
        196,
        201,
        222,
        238,
        249,
        258,
        264,
        269,
        276,
        285,
        291,
        299,
        321,
        329,
        331,
        332
      ]
    },
    {
      "id": 5,
      "code": "TEST NG-01",
      "name": "Test Filter NG-001",
      "description": "Updating the filter for testing purposes",
      "type": "RANGE",
      "options": {
        "range_auto_compute": true,
        "minPlaceholder": "50",
        "maxPlaceholder": "100"
      },
      "query_param_filter": "range",
      "column_configuration": {
        "name": "connectivity_speed",
        "label": "Download Speed (connectivity_speed)",
        "type": "int",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "downcast_aggr_str": "{val} / (1000 * 1000)",
          "upcast_aggr_str": "{val} * 1000 * 1000",
          "applicable_filter_types": {
            "RANGE": [
              "range"
            ],
            "INPUT": [
              "exact"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 70,
        "first_name": "Vaishnavi",
        "last_name": "Akshay",
        "username": "vaishnavi.shivakumar@nagarro.com",
        "email": "vaishnavi.shivakumar@nagarro.com",
        "user_name": "Vaishnavi Akshay"
      },
      "active_countries_list": [
        5,
        7,
        20,
        21,
        29,
        32,
        39,
        54,
        86,
        126,
        137,
        157,
        161,
        164,
        173,
        174,
        175,
        184,
        191,
        192,
        194,
        196,
        200,
        201,
        214,
        216,
        222,
        250,
        258,
        276,
        285,
        299,
        329,
        331
      ]
    },
    {
      "id": 8,
      "code": "TEST NG-004",
      "name": "Teachers count",
      "description": "Count of teachers will be displayed here",
      "type": "INPUT",
      "options": {
        "placeholder": "Teachers count"
      },
      "query_param_filter": "exact",
      "column_configuration": {
        "name": "num_teachers",
        "label": "Number of Teachers (num_teachers)",
        "type": "int",
        "table_name": "connection_statistics_schoolweeklystatus",
        "table_alias": "school_static",
        "table_label": "Static Data",
        "options": {
          "applicable_filter_types": {
            "RANGE": [
              "range"
            ],
            "INPUT": [
              "exact"
            ]
          }
        }
      },
      "status": "PUBLISHED",
      "published_by": {
        "id": 70,
        "first_name": "Vaishnavi",
        "last_name": "Akshay",
        "username": "vaishnavi.shivakumar@nagarro.com",
        "email": "vaishnavi.shivakumar@nagarro.com",
        "user_name": "Vaishnavi Akshay"
      },
      "active_countries_list": [
        7,
        32,
        126,
        149,
        164,
        174,
        184,
        186,
        200,
        222,
        285,
        299,
        332
      ]
    }
  ]
}