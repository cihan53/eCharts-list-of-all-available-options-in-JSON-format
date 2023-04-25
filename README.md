First of all, go to https://echarts.apache.org/en/option.html.

open browser console and run

```JS  
JSON.stringify(window.__EC_DOC_option_outline) 
```

and convert all values to json format.

There will be some syntax errors. You can use manual or online tools.

Save the resulting JSON file and run the schema builder

`` yarn start ``
