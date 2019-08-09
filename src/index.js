require("@babel/polyfill")
const callApi = require("./callApi.js")
const getSchema = require("./getSchema.js")
const getData = require("./getData.js")

const wdc = tableau.makeConnector()

wdc.getSchema = function(schemaCallback) {
    getSchema(schemaCallback)
}

wdc.getData = function(table, doneCallback) {
    getData(table, doneCallback)
}

async function setupConnector() {
    const search_query = document.querySelector("#search_query").value
    const { data } = await callApi(search_query)
    const connectionData = {
        data
    }
    tableau.connectionData = JSON.stringify(connectionData)
    tableau.connectionName = "Lingo4G Patents View Prototype WDC"
    tableau.submit()
}

tableau.registerConnector(wdc)
const fetchButton = document.querySelector("#search_button")
fetchButton.addEventListener("click", function() {
    setupConnector()
})
