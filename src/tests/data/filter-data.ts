export default {
    "count": 10,
    "results": [
        {
            "name": "Building-id",
            "type": "DROPDOWN_MULTISELECT",
            "description": "Test filter",
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
            "query_param_filter": "in"
        },
        {
            "name": "Building Id",
            "type": "INPUT",
            "description": "building id",
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
            "options": {
                "placeholder": "Enter building id"
            },
            "query_param_filter": "contains"
        },
        {
            "name": "Computer availability",
            "type": "BOOLEAN",
            "description": "Enter no.",
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
            "options": {
                "choices": [
                    {
                        "label": "Yes",
                        "value": "true"
                    },
                    {
                        "label": "No",
                        "value": "false"
                    },
                    {
                        "label": "Unknown",
                        "value": "none"
                    }
                ]
            },
            "query_param_filter": "on"
        },
        {
            "name": "Coverage Type",
            "type": "DROPDOWN_MULTISELECT",
            "description": "Coverage Type",
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
            "options": {
                "live_choices": true,
                "choices": [
                    {
                        "label": "4G",
                        "value": "4g"
                    },
                    {
                        "label": "Unknown",
                        "value": "unknown"
                    }
                ]
            },
            "query_param_filter": "in"
        },
        {
            "name": "Equipment's count",
            "type": "RANGE",
            "description": "Filter to check the equipment's count",
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
            "options": {
                "minPlaceholder": "min(30)",
                "maxPlaceholder": "max(100)",
                "range_auto_compute": false,
                "include_none_filter": true
            },
            "query_param_filter": "range"
        },
        {
            "name": "Maps views - Grouped",
            "type": "DROPDOWN",
            "description": "Describes the views of maps",
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
            "query_param_filter": "exact"
        },
        {
            "name": "No of Computer",
            "type": "RANGE",
            "description": "",
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
            "options": {
                "range_auto_compute": true,
                "minPlaceholder": "0",
                "maxPlaceholder": "10000",
                "include_none_filter": true,
                "active_range": {
                    "min_value": 0,
                    "max_value": 1450,
                    "min_place_holder": "Min (0)",
                    "max_place_holder": "Max (1450)"
                }
            },
            "query_param_filter": "range"
        },
        {
            "name": "Region",
            "type": "INPUT",
            "description": "Enter region",
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
            "options": {
                "placeholder": "Enter region"
            },
            "query_param_filter": "contains"
        },
        {
            "name": "School area type - Org",
            "type": "DROPDOWN",
            "description": "Urban or rural region in which school is located.",
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
            "options": {
                "live_choices": true,
                "placeholder": "Placeholder",
                "choices": [
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
            "query_param_filter": "iexact"
        },
        {
            "name": "Test Filter NG-001",
            "type": "RANGE",
            "description": "Updating the filter for testing purposes",
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
            "options": {
                "range_auto_compute": true,
                "minPlaceholder": "50",
                "maxPlaceholder": "100",
                "include_none_filter": true,
                "active_range": {
                    "min_value": 35,
                    "max_value": 36,
                    "min_place_holder": "Min (35)",
                    "max_place_holder": "Max (36)"
                }
            },
            "query_param_filter": "range"
        }
    ]
}