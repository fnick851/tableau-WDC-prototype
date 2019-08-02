const calculateSchema = (schemaCallback) => {
    const { flattenObj } = JSON.parse(tableau.connectionData)

    let numOfKeys = 0
    let biggestObj = 0
    flattenObj.forEach(element => {
            const lengthOfKeys = Object.keys(element).length
            if (lengthOfKeys > numOfKeys) {
                numOfKeys = lengthOfKeys
                biggestObj = element
            }
    })

    const columns = []
    Object.keys(biggestObj).forEach(element => {
        columns.push(
            {
                id: element,
                dataType: getDataType(element)
            }
        )
    })

    function getDataType(key) {
        if (key === 'display' || 
            key === 'text' || 
            key.includes('document_patent_number_list')
        ) {
            return tableau.dataTypeEnum.string
        }
        return tableau.dataTypeEnum.float
    }

    tableau.connectionData = JSON.stringify({
        flattenObj,
        columns
    })

    const cols = columns.map(element => {
        const cleanId = element.id.replace(".", "_")
        const dataType = element.dataType
        return {
            id: cleanId,
            dataType
        }
    })

    console.log(columns, cols)


    const tableSchema = {
        id: "lingo4g_api_v1_analysis_res_filtered",
        alias:
            "Filtered result of calling Lingo4G endpoint /api/v1/analysis?async=false",
        columns: cols 
    }
    schemaCallback([tableSchema])
}

module.exports = calculateSchema
