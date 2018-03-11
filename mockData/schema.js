const schema = {
  "type": "object",
  "properties": {
    "geneInfo": {
      "type": "object",
      "properties": {
        "attributes": {
          "type": "object",
          "properties": {
            "ensembl_gene_id": {
              "enum": ["ENSG00000121410"]
            },
            "entrez_id": {
              "enum": ["1"]
            },
            "gene_family": {
              "enum": ["Immunoglobulin like domain containing"]
            },
            "hgnc_id": {
              "enum": ["HGNC:5"]
            },
            "location": {
              "enum": ["19q13.43"]
            },
            "name": {
              "enum": ["alpha-1-B glycoprotein"]
            },
            "pubmed_id": {
              "enum": ["2591067"]
            },
            "symbol": {
              "enum": ["A1BG"]
            }
          },
          "required": ["ensembl_gene_id", "entrez_id", "gene_family", "hgnc_id", "location", "name", "pubmed_id", "symbol"]
        },
        "id": {
          "enum": ["1"]
        },
        "links": {
          "type": "object",
          "properties": {
            "self": {
              "enum": ["/genes/A1BG"]
            }
          },
          "required": ["self"]
        },
        "relationships": {
          "type": "object",
          "properties": {
            "crispr_data": {
              "type": "object",
              "properties": {
                "links": {
                  "type": "object",
                  "properties": {
                    "related": {
                      "enum": ["/genes/A1BG/datasets/crispr"]
                    }
                  },
                  "required": ["related"]
                }
              },
              "required": ["links"]
            }
          },
          "required": ["crispr_data"]
        },
        "type": {
          "enum": ["gene"]
        }
      },
      "required": ["attributes", "id", "links", "relationships", "type"]
    },
    "tissues": {
      "type": "array",
      "minItems": 10,
      "maxItems": 20,
      "uniqueItems": "tissue",
      "items": {
        "type": "object",
        "properties": {
          "tissue": {
            "type": "string",
            "unique": true
          },
          "counts": {
            "minimum": 1,
            "maximum": 20
          }
        },
        "required": ["tissue", "counts"]
      }
    },
    "essentialities": {
      "type": "array",
      "minItems": 1,
      "maxItems": 10,
      "uniqueItems": false,
      "items": {
        "type": "object",
        "properties": {
          "attributes": {
            "type": "object",
            "properties": {
              "corrected_fold_changed": {
                "type": "string",
                "format": "corrected_fold_change"
              },
              "gene_symbol": {
                "type": "string",
                "format": "gene"
              },
              "model_name": {
                "type": "string",
                "format": "model"
              },
              "normalised_essentiality": {
                "type": "string",
                "format": "normalised_essentiality"
              }
            },
            "required": ["corrected_fold_changed", "gene_symbol", "model_name", "normalised_essentiality"]
          }
        },
        "required": ["attributes"]
      }
    }
  },
  "required": ["tissues", "geneInfo", "essentialities"]
};


module.exports = schema;
