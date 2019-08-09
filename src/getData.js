const getData = (table, doneCallback) => {
    const connectionData = JSON.parse(tableau.connectionData)
    const { data } = connectionData
    let tableData = []

    if (table.tableInfo.id == "labels") {
        const labelList = data.labels.list
        tableData = labelList.map(({ display, text, score, df, id }) => {
            return {
                display,
                text,
                score,
                df,
                id
            }
        })
    }

    if (table.tableInfo.id == "label_document_lookup") {
        const labelList = data.labels.list
        labelList.forEach(({ id, documents }) => {
            documents.forEach(el => {
                tableData.push({
                    label_id: id,
                    document_id: el
                })
            })
        })
    }

    if (table.tableInfo.id == "label_coordinates") {
        const labelCoordList = data.documents.embedding.labels
        tableData = labelCoordList.map(({ id, x, y }) => {
            return {
                id,
                x,
                y
            }
        })
    }

    if (table.tableInfo.id == "document_coordinates") {
        const documentCoordList = data.documents.embedding.documents
        tableData = documentCoordList.map(({ id, x, y }) => {
            return {
                id,
                x,
                y
            }
        })
    }

    if (table.tableInfo.id == "document_patent_numbers") {
        const patentNumberList = data.documents.list
        patentNumberList.forEach(({ id, content }) => {
            content[0].values.forEach(patentNo => {
                tableData.push({
                    id,
                    patent_number: patentNo
                })
            })
        })
    }

    table.appendRows(tableData)
    doneCallback()
}

module.exports = getData
