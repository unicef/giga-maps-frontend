export const apiList = {
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "code": "SCHOOL",
      "name": "School location",
      "category": "public",
      "description": "API to list school ID, name and location.",
      "country_filter_applicable": true,
      "school_filter_applicable": true,
      "giga_id_filter_applicable": true,
      "indicator_filter_applicable": false,
      "date_range_filter_applicable": false,
      "documentation_url": "http://localhost:8000/api/locations/schools-download/",
      "download_url": "/api/locations/schools-download/",
      "report_title": "School_report_26-03-2024_14-25-12.csv",
      "default_filters": {
        "country_id": "",
        "school_id": "",
        "giga_id_school": ""
      },
      "is_unlocked": true,
      "created": "26-02-2024 13:07:33",
      "last_modified_at": "28-02-2024 08:20:33"
    },
    {
      "id": 2,
      "code": "DAILY_CHECK_APP",
      "name": "Giga Meter",
      "category": "private",
      "description": "API to query list schools and countries with GigaMeter installed and their raw measurements indicators like download speed, latency, upload speed etc.",
      "country_filter_applicable": false,
      "school_filter_applicable": false,
      "giga_id_filter_applicable": false,
      "indicator_filter_applicable": false,
      "date_range_filter_applicable": false,
      "documentation_url": "",
      "download_url": "",
      "report_title": "",
      "default_filters": {},
      "is_unlocked": false,
      "created": "26-02-2024 13:07:33",
      "last_modified_at": "28-02-2024 08:20:33"
    }
  ]
}

export const filterApiList = [
  {
    "id": 1,
    "code": "SCHOOL",
    "name": "School location",
    "category": "public",
    "description": "API to list school ID, name and location.",
    "country_filter_applicable": true,
    "school_filter_applicable": true,
    "giga_id_filter_applicable": true,
    "indicator_filter_applicable": false,
    "date_range_filter_applicable": false,
    "documentation_url": "http://localhost:8000/api/locations/schools-download/",
    "download_url": "/api/locations/schools-download/",
    "report_title": "School_report_26-03-2024_14-30-04.csv",
    "default_filters": {
      "country_id": "",
      "school_id": "",
      "giga_id_school": ""
    },
    "is_unlocked": true,
    "created": "26-02-2024 13:07:33",
    "last_modified_at": "28-02-2024 08:20:33"
  },
  {
    "id": 2,
    "code": "DAILY_CHECK_APP",
    "name": "Giga Meter",
    "category": "private",
    "description": "API to query list schools and countries with GigaMeter installed and their raw measurements indicators like download speed, latency, upload speed etc.",
    "country_filter_applicable": false,
    "school_filter_applicable": false,
    "giga_id_filter_applicable": false,
    "indicator_filter_applicable": false,
    "date_range_filter_applicable": false,
    "documentation_url": "",
    "download_url": "",
    "report_title": "",
    "default_filters": {},
    "is_unlocked": false,
    "created": "26-02-2024 13:07:33",
    "last_modified_at": "28-02-2024 08:20:33"
  },
]