const axios = require("axios")
const flatten = require("flat")

const getFlatObj = async (search_query) => {
    const getApiUrl =
        'http://54.175.11.175:8080/api/v1/analysis?spec={"scope":{"limit":"unlimited","selector":{"type":"byQuery","query":"' +
        search_query +
        '","queryParser":""}},"labels":{"maxLabels":100,"source":{"fields":[{"name":"patent_title$phrases","weight":1},{"name":"patent_abstract$phrases","weight":1}]},"surface":{"minWordCount":1,"maxWordCount":8,"minCharacterCount":4,"minWordCharacterCountAverage":2.9,"preferredWordCount":2.5,"preferredWordCountDeviation":2.5,"singleWordLabelWeightMultiplier":0.5,"capitalizedLabelWeight":1,"uppercaseLabelWeight":1,"acronymLabelWeight":1,"exclude":[{"type":"project","dictionary":"default"}]},"frequencies":{"minAbsoluteDf":2,"minRelativeDf":0,"maxRelativeDf":0.4,"maxLabelsPerDocument":10,"truncatedPhraseThreshold":0.2},"probabilities":{"autoStopLabelRemovalStrength":0.35,"autoStopLabelMinCoverage":0.4},"scorers":{"tokenCountScorerWeight":1,"tfScorerWeight":1,"idfScorerWeight":1,"completePhrasesScorerWeight":1,"truncatedPhrasesScorerWeight":1,"dictionaryScorerWeight":1,"tokenCaseScorerWeight":1},"arrangement":{"enabled":false,"algorithm":{"type":"ap","ap":{"maxIterations":2000,"minSteadyIterations":100,"threads":"auto","softening":0.9,"damping":0.9,"minPruningGain":0.3,"inputPreference":0,"preferenceInitializer":"NONE","preferenceInitializerScaling":1}},"relationship":{"type":"cooccurrences","cooccurrences":{"cooccurrenceWindowSize":32,"cooccurrenceCountingAccuracy":0.5,"similarityWeighting":"INCLUSION","threads":"auto"}}},"direct":[]},"documents":{"arrangement":{"enabled":true,"algorithm":{"type":"ap","ap":{"maxIterations":2000,"minSteadyIterations":100,"threads":"8","softening":0.9,"damping":0.9,"minPruningGain":0.3,"inputPreference":0,"addSelfSimilarityToPreference":false},"maxClusterLabels":3,"maxLabelsPerDocument":10},"relationship":{"type":"mlt","mlt":{"maxSimilarDocuments":8,"minDocumentLabels":1,"maxQueryLabels":4,"minQueryLabelOccurrences":1,"minMatchingQueryLabels":1,"maxScopeSizeForSubIndex":0.3,"maxInMemorySubIndexSize":8000000,"threads":"16"}}},"embedding":{"enabled":true,"algorithm":{"type":"lv","lv":{"maxIterations":300,"negativeEdgeCount":5,"negativeEdgeWeight":2,"negativeEdgeDenominator":1,"threads":"16"}},"relationship":{"type":"mlt","mlt":{"maxSimilarDocuments":8,"minDocumentLabels":1,"maxQueryLabels":4,"minQueryLabelOccurrences":1,"minMatchingQueryLabels":1,"maxScopeSizeForSubIndex":0.3,"maxInMemorySubIndexSize":8000000,"threads":"16","maxSimilarDocumentsPerLabel":5}}}},"output":{"format":"json","parameters":{},"pretty":false,"labels":{"enabled":true,"labelFormat":"ORIGINAL","documents":{"enabled":true,"maxDocumentsPerLabel":10,"outputScores":false}},"documents":{"enabled":true,"onlyWithLabels":true,"onlyAssignedToLabels":false,"labels":{"enabled":false,"maxLabelsPerDocument":2147483647,"minLabelOccurrencesPerDocument":0},"content":{"enabled":true,"fields":[{"name":"patent_number"}]}}},"performance":{"threads":"16"},"summary":{"labeledDocuments":true},"debug":{"logCandidateLabelPartialScores":false}}&async=false'
    let flattenList = {}

    const response = await axios.get(getApiUrl)
    const labelsList = response.data.labels.list
    const documentsEmbeddingLabels = response.data.documents.embedding.labels
    const documentList = response.data.documents.list

    const labelCoordMergedList = labelsList.map(function(labelDetail) {
        const match = documentsEmbeddingLabels.find(function(
            labelCoord
        ) {
            return labelCoord.id === labelDetail.id
        })

        return { ...labelDetail, ...match }
    })

    const patentNumberMergerd = labelCoordMergedList.map(
        labelDetail => {
            const filteredList = documentList.filter(documentDetail =>
                labelDetail.documents.includes(documentDetail.id)
            )
            const patentNumberList = filteredList.map(
                documentDetail => documentDetail.content[0].values[0]
            )

            delete labelDetail.documents
            labelDetail.document_patent_number_list = patentNumberList

            return labelDetail
        }
    )

    flattenList = patentNumberMergerd.map(nonFlatEl =>
        flatten(nonFlatEl)
    )

    return { flattenList }
}

module.exports = getFlatObj