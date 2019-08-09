const getSchema = schemaCallback => {
    const labels_col = [
        {
            id: "display",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "text",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "score",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "df",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "id",
            dataType: tableau.dataTypeEnum.int
        }
    ]

    const labelsTable = {
        id: "labels",
        alias: "list of labels",
        columns: labels_col
    }

    const label_to_document = [
        {
            id: "label_id",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "document_id",
            dataType: tableau.dataTypeEnum.float
        }
    ]

    const labelDocumentLookupTable = {
        id: "label_document_lookup",
        alias: "look up table to map document to label",
        columns: label_to_document
    }

    const labels_coord_col = [
        {
            id: "id",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "x",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "y",
            dataType: tableau.dataTypeEnum.float
        }
    ]

    const labelsCoordTable = {
        id: "label_coordinates",
        alias: "list of label coordinates",
        columns: labels_coord_col
    }

    const documents_coord_col = [
        {
            id: "id",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "x",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "y",
            dataType: tableau.dataTypeEnum.float
        }
    ]

    const documentsCoordTable = {
        id: "document_coordinates",
        alias: "list of document coordinates",
        columns: documents_coord_col
    }

    const document_patent_numbers = [
        {
            id: "id",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "patent_number",
            dataType: tableau.dataTypeEnum.string
        }
    ]

    const patentNumberTable = {
        id: "document_patent_numbers",
        alias: "list of document patent numbers",
        columns: document_patent_numbers
    }

    schemaCallback([
        labelsTable,
        labelDocumentLookupTable,
        labelsCoordTable,
        documentsCoordTable,
        patentNumberTable
    ])
}

module.exports = getSchema
