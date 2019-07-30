;(function() {
    const wdc = tableau.makeConnector()

    wdc.getSchema = function(schemaCallback) {
        const cols = [
            {
                id: "documents_embedding_labels_id",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "documents_embedding_labels_x",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "documents_embedding_labels_y",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "labels_list_id",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "labels_list_display",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "labels_list_text",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "labels_list_score",
                dataType: tableau.dataTypeEnum.float
            },
            {
                id: "labels_list_df",
                dataType: tableau.dataTypeEnum.float
            }
        ]

        const tableSchema = {
            id: "lingo4g_api_v1_analysis_res_filtered",
            alias:
                "Filtered result of calling Lingo4G endpoint /api/v1/analysis?async=false",
            columns: cols
        }

        schemaCallback([tableSchema])
    }

    wdc.getData = function(table, doneCallback) {
        const connectionData = JSON.parse(tableau.connectionData)
        const search_query = connectionData.search_query

        const getApiUrl =
            'http://54.175.11.175:8080/api/v1/analysis?spec={"scope":{"limit":"unlimited","selector":{"type":"byQuery","query":"' +
            search_query +
            '","queryParser":""}},"labels":{"maxLabels":100,"source":{"fields":[{"name":"patent_title$phrases","weight":1},{"name":"patent_abstract$phrases","weight":1}]},"surface":{"minWordCount":1,"maxWordCount":8,"minCharacterCount":4,"minWordCharacterCountAverage":2.9,"preferredWordCount":2.5,"preferredWordCountDeviation":2.5,"singleWordLabelWeightMultiplier":0.5,"capitalizedLabelWeight":1,"uppercaseLabelWeight":1,"acronymLabelWeight":1,"exclude":[{"type":"project","dictionary":"default"}]},"frequencies":{"minAbsoluteDf":2,"minRelativeDf":0,"maxRelativeDf":0.4,"maxLabelsPerDocument":10,"truncatedPhraseThreshold":0.2},"probabilities":{"autoStopLabelRemovalStrength":0.35,"autoStopLabelMinCoverage":0.4},"scorers":{"tokenCountScorerWeight":1,"tfScorerWeight":1,"idfScorerWeight":1,"completePhrasesScorerWeight":1,"truncatedPhrasesScorerWeight":1,"dictionaryScorerWeight":1,"tokenCaseScorerWeight":1},"arrangement":{"enabled":false,"algorithm":{"type":"ap","ap":{"maxIterations":2000,"minSteadyIterations":100,"threads":"auto","softening":0.9,"damping":0.9,"minPruningGain":0.3,"inputPreference":0,"preferenceInitializer":"NONE","preferenceInitializerScaling":1}},"relationship":{"type":"cooccurrences","cooccurrences":{"cooccurrenceWindowSize":32,"cooccurrenceCountingAccuracy":0.5,"similarityWeighting":"INCLUSION","threads":"auto"}}},"direct":[]},"documents":{"arrangement":{"enabled":true,"algorithm":{"type":"ap","ap":{"maxIterations":2000,"minSteadyIterations":100,"threads":"8","softening":0.9,"damping":0.9,"minPruningGain":0.3,"inputPreference":0,"addSelfSimilarityToPreference":false},"maxClusterLabels":3,"maxLabelsPerDocument":10},"relationship":{"type":"mlt","mlt":{"maxSimilarDocuments":8,"minDocumentLabels":1,"maxQueryLabels":4,"minQueryLabelOccurrences":1,"minMatchingQueryLabels":1,"maxScopeSizeForSubIndex":0.3,"maxInMemorySubIndexSize":8000000,"threads":"16"}}},"embedding":{"enabled":true,"algorithm":{"type":"lv","lv":{"maxIterations":300,"negativeEdgeCount":5,"negativeEdgeWeight":2,"negativeEdgeDenominator":1,"threads":"16"}},"relationship":{"type":"mlt","mlt":{"maxSimilarDocuments":8,"minDocumentLabels":1,"maxQueryLabels":4,"minQueryLabelOccurrences":1,"minMatchingQueryLabels":1,"maxScopeSizeForSubIndex":0.3,"maxInMemorySubIndexSize":8000000,"threads":"16","maxSimilarDocumentsPerLabel":5}}}},"output":{"format":"json","parameters":{},"pretty":false,"labels":{"enabled":true,"labelFormat":"ORIGINAL","documents":{"enabled":false,"maxDocumentsPerLabel":10,"outputScores":false}},"documents":{"enabled":true,"onlyWithLabels":true,"onlyAssignedToLabels":false,"labels":{"enabled":false,"maxLabelsPerDocument":2147483647,"minLabelOccurrencesPerDocument":0},"content":{"enabled":true,"fields":[{"name":"patent_number"}]}}},"performance":{"threads":"16"},"summary":{"labeledDocuments":true},"debug":{"logCandidateLabelPartialScores":false}}&async=false'
        const tableData = []

        console.log(getApiUrl)

        axios
            .get(
                // postApiUrl,
                getApiUrl
                // postData,
                // postHeader,
            )
            .then(function(response) {
                console.log("response data: ", response.data)
                const labelsEmbedPos = response.data.documents.embedding.labels
                const labels = response.data.labels.list

                for (var i = 0; i < labelsEmbedPos.length; i++) {
                    tableData.push({
                        documents_embedding_labels_id: labelsEmbedPos[i].id,
                        documents_embedding_labels_x: labelsEmbedPos[i].x,
                        documents_embedding_labels_y: labelsEmbedPos[i].y,
                        labels_list_id: labels[i].id,
                        labels_list_display: labels[i].display,
                        labels_list_text: labels[i].text,
                        labels_list_score: labels[i].score,
                        labels_list_df: labels[i].df
                    })
                }

                console.log("filtered data: ", tableData)

                table.appendRows(tableData)
                doneCallback()
            })
            .catch(function(error) {
                console.log(error)
            })
    }

    setupConnector = function() {
        const search_query = document.querySelector("#search_query").value

        var connectionData = {
            search_query: search_query
        }
        tableau.connectionData = JSON.stringify(connectionData)
        tableau.submit()
    }

    tableau.registerConnector(wdc)

    const fetchButton = document.querySelector("#search_button")

    fetchButton.addEventListener("click", function() {
        setupConnector()
        tableau.connectionName = "Lingo4G Patents View Prototype WDC"
        tableau.submit()
    })
})()
