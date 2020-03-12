var treeData0 = [
  {
    "name" : "n1",
    "childtype" : "none",
    "variable" : "x1",
    "threshold" : 5,
    "parent": "null",
    "children": [
      {
        "name": "n2",
        "childtype" : "left",
        "variable" : "x2",
        "threshold" : -5,
        "parent": "n1",
        "children": [
          {
            "name": "n3",
            "childtype" : "left",
            "variable" : "x1",
            "threshold" : 5,
            "parent": "n2",
            "children": [
              {
                "name": "Leaf1",
                "childtype" : "left",
                "value": 1,
                "parent": "n3"
              },
              {
                "name": "Leaf2",
                "childtype" : "right",
                "value": 2,
                "parent": "n3"
              }
            ]
          },
          {
            "name": "n4",
            "childtype" : "right",
            "variable" : "x3",
            "threshold" : 5,
            "parent": "n2",
            "children": [
              {
                "name": "Leaf3",
                "childtype" : "left",
                "value": 3,
                "parent": "n4"
              },
              {
                "name": "Leaf4",
                "childtype" : "right",
                "value": 4,
                "parent": "n4"
              }
            ]
          }
        ]
      },
      {
        "name": "n5",
        "childtype" : "right",
        "variable" : "x2",
        "threshold" : 5,
        "parent": "n1",
        "children": [
          {
            "name": "n6",
            "childtype" : "left",
            "variable" : "x3",
            "threshold" : -5,
            "parent": "n5",
            "children": [
              {
                "name": "Leaf5",
                "childtype" : "left",
                "value": 5,
                "parent": "n6"
              },
              {
                "name": "Leaf6",
                "childtype" : "right",
                "value": 6,
                "parent": "n6"
              }
            ]
          },
          {
            "name": "n7",
            "variable" : "x1",
            "childtype" : "right",
            "threshold" : 5,
            "parent": "n5",
            "children": [
              {
                "name": "Leaf7",
                "childtype" : "left",
                "value": 7,
                "parent": "n7"
              },
              {
                "name": "Leaf8",
                "childtype" : "right",
                "value": 8,
                "parent": "n7"
              }
            ]
          }
        ]
      }
    ]
  }
];