export default {
    "count": 13,
    "results": [
        { 
            "name": "School Region",
            "type": "drop-down",
            "description": "",
            "choices": [
                {
                    "label": "Urban",
                    "value": "urban"
                },
                {
                    "label": "Rural",
                    "value": "rural"
                }
            ],
            "parameter": {
                "label": "Region",
                "table": "schools",
                "field": "environment",
                "filter": "iexact"
            },
            "active_countries_list": null
        },
        {
            "name": "School Type",
            "type": "drop-down",
            "description": "",
            "choices": [
                {
                    "label": "Private",
                    "value": "private"
                },
                {
                    "label": "Public",
                    "value": "public"
                }
            ],
            "parameter": {
                "label": "School Type",
                "table": "schools",
                "field": "school_type",
                "filter": "iexact"
            },
            "active_countries_list": null
        },
        {
            "name": "Education Level",
            "type": "drop-down",
            "description": "",
            "choices": [
                {
                    "label": "Primary",
                    "value": "primary"
                },
                {
                    "label": "Secondary",
                    "value": "secondary"
                }
            ],
            "parameter": {
                "label": "Education Level",
                "table": "schools",
                "field": "education_level",
                "filter": "iexact"
            },
            "active_countries_list": null
        },
        {
            "name": "Data Source",
            "type": "input",
            "description": "",
            "parameter": {
                "label": "Data Source",
                "table": "schools",
                "field": "data_source",
                "filter": "icontain"
            },
            "active_countries_list": null
        },
        {
            "name": "Connected By",
            "type": "input",
            "description": "",
            "parameter": {
                "label": "Connected By",
                "table": "schools",
                "field": "connected_by",
                "filter": "icontain"
            },
            "active_countries_list": null
        },
        {
            "name": "Funded By",
            "type": "input",
            "description": "",
            "parameter": {
                "label": "Funded By",
                "table": "schools",
                "field": "funded_by",
                "filter": "icontain"
            },
            "active_countries_list": null
        },
        {
            "name": "No of Computers",
            "type": "range",
            "description": "",
            "parameter": {
                "label": "# of Computers",
                "table": "school_static",
                "field": "num_computers",
                "filter": "range"
            },
            "active_countries_list": null
        },
        {
            "name": "No of Students",
            "type": "range",
            "description": "",
            "parameter": {
                "label": "# of Students",
                "table": "school_static",
                "field": "num_students",
                "filter": "range"
            },
            "active_countries_list": null
        },
        {
            "name": "No of Teachers",
            "type": "range",
            "description": "",
            "parameter": {
                "label": "# of Teachers",
                "table": "school_static",
                "field": "num_teachers",
                "filter": "range"
            },
            "active_countries_list": null
        },
        {
            "name": "Download Speed",
            "type": "range",
            "description": "",
            "parameter": {
                "label": "Connectivity Speed",
                "table": "school_weekly",
                "field": "connectivity_speed",
                "filter": "range"
            },
            "downcast_aggr_str": "{val} / (1000 * 1000)",
            "upcast_aggr_str": "{val} * 1000 * 1000",
            "active_countries_list": null
        },
        {
            "name": "Latency",
            "type": "range",
            "description": "",
            "parameter": {
                "label": "Latency",
                "table": "school_weekly",
                "field": "connectivity_latency",
                "filter": "range"
            },
            "active_countries_list": null
        },
        {
            "name": "Has Computer Lab",
            "type": "boolean",
            "description": "",
            "parameter": {
                "label": "Has Computer Lab",
                "table": "school_static",
                "field": "computer_lab",
                "filter": "on"
            },
            "active_countries_list": null
        },
        {
            "name": "Coverage Type",
            "type": "drop-down-multiselect",
            "description": "",
            "choices": [
                {
                    "label": "Unknown",
                    "value": "unknown"
                },
                {
                    "label": "No",
                    "value": "no"
                },
                {
                    "label": "2G",
                    "value": "2g"
                },
                {
                    "label": "3G",
                    "value": "3g"
                },
                {
                    "label": "4G",
                    "value": "4g"
                }
            ],
            "parameter": {
                "label": "Coverage Type",
                "table": "school_static",
                "field": "coverage_type",
                "filter": "in"
            },
            "active_countries_list": null
        }
    ]
}