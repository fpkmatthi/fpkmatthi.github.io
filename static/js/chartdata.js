var parentFolder = window.location.href
  .split(window.location.hostname)[1]
  .split('/')[2];


var discTypes = ['Dominant', 'Consciousness', 'Stability', 'Influence'];
var mbtiTypesEnergy = ['Extravert', 'Introvert'];
var mbtiTypesAttention = ['Sensing', 'Intuition'];
var mbtiTypesDecision = ['Thinking', 'Feeling'];
var mbtiTypesLiving = ['Judging', 'Perceiving'];


// if (parentFolder === 'nl'){
//   discTypes = ['Dominant', 'Conscentieus', 'Stabiel', 'Invloed'];
//   mbtiTypesEnergy = ['Extravert', 'Introvert'];
//   mbtiTypesAttention = ['Aanvoelen', 'Intuïtie'];
//   mbtiTypesDecision = ['Denken', 'Voelen'];
//   mbtiTypesLiving = ['Oordelen', 'Waarnemen'];
// }

// if (parentFolder == 'fr'){
//   discTypes = ['Dominant', 'Conscience', 'Stabilité', 'Influence'];
//   mbtiTypesEnergy = ['Extraverti', 'Introverti'];
//   mbtiTypesAttention = ['Percevoir', 'Intuition'];
//   mbtiTypesDecision = ['Penser', 'Sentir'];
//   mbtiTypesLiving = ['Judging', 'Perceiving'];
// }

var discTest = document.getElementById('discTestPie');
var discTestPie = new Chart(discTest, {
  type: 'pie',
  data: {
    labels: discTypes,
    datasets: [
      {
        data: [36, 28, 21, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        fontSize: 17
      }
    },
    scales: {
      xAxes: [
        {
          display: false,

          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          display: false,
          gridLines: {
            display: false
          },
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});

var mbtiTestEnergy = document.getElementById('mbtiTestEnergyBar');
var mbtiTestEnergyBar = new Chart(mbtiTestEnergy, {
  type: 'horizontalBar',
  data: {
    datasets: [
      {
        label: mbtiTypesEnergy[0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)'
        ],
        data: [-12.5],
        stack: 'a'
      },
      {
        label: mbtiTypesEnergy[1],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)'
        ],
        data: [87.5],
        stack: 'a'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: {
      position: 'top',
      labels: {
        padding: 20,
        fontSize: 17
      }
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          display: false,
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          maxBarThickness: 60,
          stacked: true,
          display: false,
          gridLines: {
            display: false
          },
        }
      ]
    }
  }
});

var mbtiTestAttention = document.getElementById('mbtiTestAttentionBar');
var mbtiTestAttentionBar = new Chart(mbtiTestAttention, {
  type: 'horizontalBar',
  data: {
    datasets: [
      {
        label: mbtiTypesAttention[0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)'
        ],
        data: [-25],
        stack: 'a'
      },
      {
        label: mbtiTypesAttention[1],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)'
        ],
        data: [75],
        stack: 'a'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: {
      position: 'top',
      labels: {
        padding: 20,
        fontSize: 17
      }
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          display: false,
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          maxBarThickness: 60,
          stacked: true,
          display: false,
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      ]
    }
  }
});

var mbtiTestDecision = document.getElementById('mbtiTestDecisionBar');
var mbtiTestDecisionBar = new Chart(mbtiTestDecision, {
  type: 'horizontalBar',
  data: {
    datasets: [
      {
        label: mbtiTypesDecision[0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)'
        ],
        data: [-87.5],
        stack: 'a'
      },
      {
        label: mbtiTypesDecision[1],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)'
        ],
        data: [12.5],
        stack: 'a'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: {
      position: 'top',
      labels: {
        padding: 20,
        fontSize: 17
      }
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          display: false,
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          display: false,
          maxBarThickness: 60,
          stacked: true,
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      ]
    }
  }
});

var mbtiTestLiving = document.getElementById('mbtiTestLivingBar');
var mbtiTestLivingBar = new Chart(mbtiTestLiving, {
  type: 'horizontalBar',
  data: {
    datasets: [
      {
        label: mbtiTypesLiving[0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)'
        ],
        data: [-75],
        stack: 'a'
      },
      {
        label: mbtiTypesLiving[1],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)'
        ],
        data: [25],
        stack: 'a'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: {
      position: 'top',
      labels: {
        padding: 20,
        fontSize: 17
      }
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          display: false,
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          display: false,
          maxBarThickness: 60,
          stacked: true,
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      ]
    }
  }
});
