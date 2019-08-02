require("@babel/polyfill")
const getFlatObj = require("./callApi.js")
const calculateSchema = require("./calculateSchema.js")

const wdc = tableau.makeConnector()

wdc.getSchema = function(schemaCallback) {
    calculateSchema(schemaCallback)
}

wdc.getData = async function(table, doneCallback) {
    const connectionData = JSON.parse(tableau.connectionData)
    const { columns, flattenObj } =  connectionData
    console.log("datas:", columns, flattenObj)

    const tableData = flattenObj.map(element => {
        const eachItem = {}
        columns.forEach(el => {
            const objKey = el.id
            const schemaKey = objKey.replace(".", "_")
            eachItem[schemaKey] = element[objKey] ? element[objKey] : null
        })
        return eachItem
    })
    
    table.appendRows(tableData)
    doneCallback()
}

async function setupConnector() {
    const search_query = document.querySelector("#search_query").value
    const { flattenList } = await getFlatObj(search_query)
    const connectionData = {
        flattenObj: flattenList
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
