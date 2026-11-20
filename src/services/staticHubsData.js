/**
 * Static Interchange Hub Specifications
 * Western Harbour Crossing, Tuen Mun Road, Tai Lam Tunnel, and Cross-Harbour Tunnel.
 */

export const BBI_HUBS = {
  WHC: {
    id: 'WHC',
    nameEn: 'Western Harbour Crossing Toll Plaza',
    nameZh: '西區海底隧道收費廣場',
    centroid: [22.3045, 114.1565],
    defaultWalkBufferSec: 90,
    platforms: [
      { id: 'bay-hki', name: 'Island Bound (港島方向)', lat: 22.3041, lng: 114.1562 },
      { id: 'bay-kln', name: 'Kowloon Bound (九龍方向)', lat: 22.3049, lng: 114.1568 }
    ],
    primaryRoutes: ['900', '904', '905', '914', '930', '930X', '960', '961', '968', '978', 'P968']
  },
  TMTCI: {
    id: 'TMTCI',
    nameEn: 'Tuen Mun Road Interchange',
    nameZh: '屯門公路轉車站',
    centroid: [22.3598, 114.0322],
    defaultWalkBufferSec: 120,
    platforms: [
      { id: 'tmtci-kln', name: 'Kowloon Bound (九龍方向上層/下層)', lat: 22.3595, lng: 114.0320 },
      { id: 'tmtci-tm', name: 'Tuen Mun Bound (屯門方向)', lat: 22.3601, lng: 114.0324 }
    ],
    primaryRoutes: ['58M', '58X', '59M', '59X', '60M', '60X', '66M', '66X', '67M', '67X', '960', '961']
  },
  TLTI: {
    id: 'TLTI',
    nameEn: 'Tai Lam Tunnel Interchange',
    nameZh: '大欖隧道轉車站',
    centroid: [22.4215, 114.0664],
    defaultWalkBufferSec: 90,
    platforms: [
      { id: 'tlti-south', name: 'Kowloon/HKI Bound (往市區)', lat: 22.4212, lng: 114.0662 },
      { id: 'tlti-north', name: 'Yuen Long Bound (往元朗/天水圍)', lat: 22.4218, lng: 114.0666 }
    ],
    primaryRoutes: ['68E', '68M', '68X', '69M', '69X', '268B', '268C', '269C', '968', '969']
  },
  CHT: {
    id: 'CHT',
    nameEn: 'Cross Harbour Tunnel Plaza',
    nameZh: '紅磡海底隧道收費廣場',
    centroid: [22.3032, 114.1808],
    defaultWalkBufferSec: 150,
    platforms: [
      { id: 'cht-hki', name: 'Hong Kong Island Bound (過海往港島)', lat: 22.3030, lng: 114.1806 },
      { id: 'cht-kln', name: 'Kowloon Bound (往九龍及新界)', lat: 22.3035, lng: 114.1810 }
    ],
    primaryRoutes: ['101', '102', '104', '106', '109', '111', '112', '116', '118', '170', '171', '182']
  }
};
