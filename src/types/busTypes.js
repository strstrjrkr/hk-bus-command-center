/**
 * Hong Kong Bus Command Center Data Models & Type Contracts
 */

/**
 * @typedef {'kmb' | 'ctb' | 'nwfb' | 'nlb' | 'mtr'} BusOperator
 */

/**
 * @typedef {'safe' | 'tight' | 'critical' | 'missed'} ConnectionConfidence
 */

/**
 * @typedef {Object} BusStopRecord
 * @property {string} stopId Unique stop identifier
 * @property {string} nameEn English stop designation
 * @property {string} nameZh Traditional Chinese stop designation
 * @property {number} lat WGS84 latitude coordinate
 * @property {number} lng WGS84 longitude coordinate
 * @property {number} seq Sequence index along the route
 */

/**
 * @typedef {Object} RealTimeEtaEntry
 * @property {string} route Bus route number (e.g. "968")
 * @property {BusOperator} operator Operating transit franchise
 * @property {number} etaSequence Order of departure (1 = next bus, 2 = following)
 * @property {string} etaTimestamp ISO 8601 destination arrival time
 * @property {number} etaRemainingSec Computed seconds remaining until arrival
 * @property {string} remark Special condition remark (e.g. "Scheduled", "Real Time")
 * @property {boolean} isGpsTracked Whether vehicle possesses an active GPS transponder
 */

/**
 * @typedef {Object} DeadReckoningVehicle
 * @property {string} tripId Synthetic or reported unique identifier
 * @property {string} route Bus route number
 * @property {BusOperator} operator Operating franchise
 * @property {number} lat Interpolated current latitude
 * @property {number} lng Interpolated current longitude
 * @property {number} heading Compass angle in degrees [0-360]
 * @property {number} speed Estimated road segment speed in km/h
 * @property {string} nextStop Target upcoming stop name
 * @property {number} secondsToNext Arrival countdown to next stop
 */

/**
 * @typedef {Object} BbiTransferProposal
 * @property {string} hubId Interchange identifier ('WHC' | 'TMTCI' | 'TLTI' | 'CHT')
 * @property {string} inboundRoute Arriving route number
 * @property {string} outboundRoute Departing route number
 * @property {string} platform Platform bay identifier
 * @property {number} probability Fractional likelihood of catching connection [0.0 - 1.0]
 * @property {number} timeWindowSec Available seconds between arrival and departure
 * @property {number} walkBufferSec Allocated walking buffer
 * @property {string} inboundEta Formatted arrival time
 * @property {string} outboundEta Formatted departure time
 * @property {ConnectionConfidence} status Visual classification
 */

/**
 * @typedef {Object} GhostBusIncident
 * @property {string} route Monitored route designation
 * @property {string} terminus Corridor direction description
 * @property {number} driftVelocity Rate of ETA slip (Gamma in seconds per second)
 * @property {string} scheduledTime Original nominal departure timestamp
 * @property {string} apiRemark Raw remark string from upstream feed
 * @property {string} reason Diagnostic explanation of irregularity
 * @property {number} confidence Diagnostic confidence percentage (0-100)
 */

/**
 * @typedef {Object} TunnelSpeedBenchmark
 * @property {string} tunnelId Identifier ('WHC' | 'CHT' | 'EHC')
 * @property {string} tunnelNameEn English name
 * @property {string} tunnelNameZh Traditional Chinese name
 * @property {string} sampleBusRoute Cross-harbour bus route
 * @property {string} mtrLine Competing MTR corridor
 * @property {number} avgSpeedKmH Highway panel detector speed
 * @property {string} congestionLevel Text description of traffic flow
 * @property {number} busTripMinutes Total estimated bus trip time
 * @property {number} mtrTripMinutes Baseline MTR trip time
 * @property {number} diffMinutes Time saved taking bus vs MTR (positive = bus faster)
 * @property {number} confidence Heuristic evaluation confidence
 */

export const BusTypeContracts = {};
