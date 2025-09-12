export default {
  "count": 32,
  "results": [
    {
      "id": 29,
      "name": "building_id_govt",
      "label": "Building Govt ID (building_id_govt)",
      "type": "str",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "\"connection_statistics_schoolweeklystatus\".\"building_id_govt\" IS NOT NULL",
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
    {
      "id": 18,
      "name": "computer_availability",
      "label": "Computer Availability (computer_availability)",
      "type": "boolean",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "computer_availability IS NOT NULL",
        "applicable_filter_types": {
          "BOOLEAN": [
            "on"
          ]
        }
      }
    },
    {
      "id": 11,
      "name": "connectivity_type",
      "label": "Connectivity Type (connectivity_type)",
      "type": "str",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "LOWER(\"connection_statistics_schoolweeklystatus\".\"connectivity_type\") != 'unknown'",
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
    {
      "id": 10,
      "name": "coverage_type",
      "label": "Coverage Type (coverage_type)",
      "type": "str",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "LOWER(\"connection_statistics_schoolweeklystatus\".\"coverage_type\") != 'unknown'",
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
    {
      "id": 26,
      "name": "device_availability",
      "label": "Device Availability (device_availability)",
      "type": "boolean",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "device_availability IS NOT NULL",
        "applicable_filter_types": {
          "BOOLEAN": [
            "on"
          ]
        }
      }
    },
    {
      "id": 7,
      "name": "connectivity_speed",
      "label": "Download Speed (connectivity_speed)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "connectivity_speed IS NOT NULL",
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
    {
      "id": 3,
      "name": "education_level",
      "label": "Education Level (education_level)",
      "type": "str",
      "description": null,
      "table_name": "schools_school",
      "table_alias": "schools",
      "table_label": "School",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "LOWER(education_level) IN ('primary', 'secondary')",
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
    {
      "id": 32,
      "name": "education_level_lower",
      "label": "Education Level (education_level_lower)",
      "type": "str",
      "description": null,
      "table_name": "schools_school",
      "table_alias": "schools",
      "table_label": "School",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "education_level_lower IS NOT NULL",
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
    {
      "id": 12,
      "name": "fiber_node_distance",
      "label": "Fiber Node Distance (fiber_node_distance)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "fiber_node_distance IS NOT NULL AND fiber_node_distance > 0",
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
    {
      "id": 8,
      "name": "computer_lab",
      "label": "Has Computer Lab (computer_lab)",
      "type": "boolean",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "computer_lab = true",
        "applicable_filter_types": {
          "BOOLEAN": [
            "on"
          ]
        }
      }
    },
    {
      "id": 9,
      "name": "connectivity",
      "label": "Has Live Connectivity (connectivity)",
      "type": "boolean",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "connectivity IS NOT NULL",
        "applicable_filter_types": {
          "BOOLEAN": [
            "on"
          ]
        }
      }
    },
    {
      "id": 13,
      "name": "microwave_node_distance",
      "label": "Microwave Node Distance (microwave_node_distance)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "microwave_node_distance IS NOT NULL AND microwave_node_distance > 0",
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
    {
      "id": 17,
      "name": "nearest_gsm_distance",
      "label": "Nearest GSM Distance (nearest_gsm_distance)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "nearest_gsm_distance IS NOT NULL AND nearest_gsm_distance > 0",
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
    {
      "id": 15,
      "name": "nearest_lte_distance",
      "label": "Nearest LTE Distance (nearest_lte_distance)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "nearest_lte_distance IS NOT NULL AND nearest_lte_distance > 0",
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
    {
      "id": 14,
      "name": "nearest_nr_distance",
      "label": "Nearest NR Distance (nearest_nr_distance)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "nearest_nr_distance IS NOT NULL AND nearest_nr_distance > 0",
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
    {
      "id": 16,
      "name": "nearest_umts_distance",
      "label": "Nearest UMTS Distance (nearest_umts_distance)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "nearest_umts_distance IS NOT NULL AND nearest_umts_distance > 0",
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
    {
      "id": 20,
      "name": "num_students_boys",
      "label": "Number of Boy Students (num_students_boys)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_students_boys IS NOT NULL AND num_students_boys > 0",
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
    {
      "id": 4,
      "name": "num_computers",
      "label": "Number of Computers (num_computers)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_computers IS NOT NULL AND num_computers > 0",
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
    {
      "id": 22,
      "name": "num_teachers_female",
      "label": "Number of Female Teachers (num_teachers_female)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_teachers_female IS NOT NULL AND num_teachers_female > 0",
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
    {
      "id": 19,
      "name": "num_students_girls",
      "label": "Number of Girl Students (num_students_girls)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_students_girls IS NOT NULL AND num_students_girls > 0",
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
    {
      "id": 23,
      "name": "num_teachers_male",
      "label": "Number of Male Teachers (num_teachers_male)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_teachers_male IS NOT NULL AND num_teachers_male > 0",
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
    {
      "id": 21,
      "name": "num_students_other",
      "label": "Number of Other Students (num_students_other)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_students_other IS NOT NULL AND num_students_other > 0",
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
    {
      "id": 28,
      "name": "num_robotic_equipment",
      "label": "Number of Robotic Equipment (num_robotic_equipment)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_robotic_equipment IS NOT NULL AND num_robotic_equipment > 0",
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
    {
      "id": 30,
      "name": "num_schools_per_building",
      "label": "Number of Schools per Building (num_schools_per_building)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_schools_per_building IS NOT NULL AND num_schools_per_building > 0",
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
    {
      "id": 5,
      "name": "num_students",
      "label": "Number of Students (num_students)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_students IS NOT NULL AND num_students > 0",
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
    {
      "id": 27,
      "name": "num_tablets",
      "label": "Number of Tablets (num_tablets)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_tablets IS NOT NULL AND num_tablets > 0",
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
    {
      "id": 6,
      "name": "num_teachers",
      "label": "Number of Teachers (num_teachers)",
      "type": "int",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "num_teachers IS NOT NULL AND num_teachers > 0",
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
    {
      "id": 1,
      "name": "environment",
      "label": "Region (environment)",
      "type": "str",
      "description": null,
      "table_name": "schools_school",
      "table_alias": "schools",
      "table_label": "School",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "environment IN ('urban', 'rural')",
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
    {
      "id": 2,
      "name": "school_type",
      "label": "School Type (school_type)",
      "type": "str",
      "description": null,
      "table_name": "schools_school",
      "table_alias": "schools",
      "table_label": "School",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "LOWER(school_type) IN ('private', 'public')",
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
    {
      "id": 31,
      "name": "school_type_lower",
      "label": "School Type (school_type_lower)",
      "type": "str",
      "description": null,
      "table_name": "schools_school",
      "table_alias": "schools",
      "table_label": "School",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "school_type_lower IS NOT NULL",
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
    {
      "id": 25,
      "name": "sustainable_business_model",
      "label": "Sustainable Business Model (sustainable_business_model)",
      "type": "boolean",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "sustainable_business_model IS NOT NULL",
        "applicable_filter_types": {
          "BOOLEAN": [
            "on"
          ]
        }
      }
    },
    {
      "id": 24,
      "name": "teachers_trained",
      "label": "Trained Teachers (teachers_trained)",
      "type": "boolean",
      "description": null,
      "table_name": "connection_statistics_schoolweeklystatus",
      "table_alias": "school_static",
      "table_label": "Static Data",
      "is_filter_applicable": true,
      "options": {
        "active_countries_filter": "teachers_trained IS NOT NULL",
        "applicable_filter_types": {
          "BOOLEAN": [
            "on"
          ]
        }
      }
    }
  ]
}