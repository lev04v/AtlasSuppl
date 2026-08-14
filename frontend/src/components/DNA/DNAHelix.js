export const CLUSTER_BUBBLES = 24;
export const BACKBONE_CLUSTERS = 140;
export const RUNG_BUBBLES = 12;
export const DNA_LENGTH = 24;
const HELIX_RADIUS_Y = 2.08;
const HELIX_RADIUS_Z = 1.02;
const HELIX_TURNS = 5.6;

const normalize = ([x, y, z]) => {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
};
const cross = ([ax, ay, az], [bx, by, bz]) => [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a, factor) => [a[0] * factor, a[1] * factor, a[2] * factor];

// Length runs along X (horizontal on screen); the coil sits in the Y-Z plane.
export const strandPoint = (index, strand = 0, total = BACKBONE_CLUSTERS) => {
  const t = index / (total - 1);
  const angle = t * Math.PI * 2 * HELIX_TURNS + strand * Math.PI;
  return [(t - 0.5) * DNA_LENGTH, Math.cos(angle) * HELIX_RADIUS_Y, Math.sin(angle) * HELIX_RADIUS_Z];
};

export const createCluster = (clusterIndex, strand = 0) => {
  const center = strandPoint(clusterIndex, strand);
  const previous = strandPoint(Math.max(0, clusterIndex - 1), strand);
  const next = strandPoint(Math.min(BACKBONE_CLUSTERS - 1, clusterIndex + 1), strand);
  const tangent = normalize([next[0] - previous[0], next[1] - previous[1], next[2] - previous[2]]);
  const radial = normalize([0, center[1], center[2]]);
  const binormal = normalize(cross(tangent, radial));
  const clusterRings = [
    { axisOffset: 0.2, radius: 0.22 },
    { axisOffset: 0, radius: 0.32 },
    { axisOffset: -0.2, radius: 0.22 },
  ];
  const bubbles = Array.from({ length: CLUSTER_BUBBLES }, (_, bubbleIndex) => {
    const ring = clusterRings[Math.floor(bubbleIndex / 8)];
    const angle = ((bubbleIndex % 8) / 8) * Math.PI * 2 + (Math.floor(bubbleIndex / 8) % 2) * 0.18;
    const jitterSeed = (clusterIndex * 131 + bubbleIndex * 17 + strand * 7) % 23;
    const jitter = (jitterSeed / 23 - 0.5) * 0.09;
    const offset = add(
      scale(tangent, ring.axisOffset + jitter),
      add(scale(radial, Math.cos(angle) * (ring.radius + jitter * 0.6)), scale(binormal, Math.sin(angle) * (ring.radius + jitter * 0.6)))
    );
    return { position: add(center, offset), clusterIndex, strand, bubbleIndex };
  });
  return { center, tangent, radial, binormal, bubbles };
};

export const createDNAClusters = () => {
  const clusters = [0, 1].map((strand) => Array.from({ length: BACKBONE_CLUSTERS }, (_, index) => createCluster(index, strand)));
  const rungs = [];
  for (let index = 2; index < BACKBONE_CLUSTERS - 2; index += 2) {
    const start = clusters[0][index].center;
    const end = clusters[1][index].center;
    for (let bubbleIndex = 0; bubbleIndex < RUNG_BUBBLES; bubbleIndex += 1) {
      const t = (bubbleIndex + 0.5) / RUNG_BUBBLES;
      rungs.push({ position: [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t, start[2] + (end[2] - start[2]) * t], rungIndex: index, bubbleIndex });
    }
  }
  // Filler bubbles between consecutive cluster centers along one backbone strand.
  // Count raised (6 -> 10) and — critically — these are now sized in DNA.jsx to match
  // the main ring bubbles, so there's no thin "neck" between one cluster and the next.
  const connectors = [];
  clusters.forEach((strandClusters, strand) => {
    for (let index = 0; index < strandClusters.length - 1; index += 1) {
      const start = strandClusters[index].center;
      const end = strandClusters[index + 1].center;
      for (let bubbleIndex = 0; bubbleIndex < 10; bubbleIndex += 1) {
        const t = (bubbleIndex + 1) / 11;
        connectors.push({ position: [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t, start[2] + (end[2] - start[2]) * t], strand, connectorIndex: index, bubbleIndex });
      }
    }
  });
  const emitters = clusters.flatMap((strandClusters, strand) => strandClusters.filter((_, index) => index % 4 === 0).map((cluster) => ({ position: cluster.center, tangent: cluster.tangent, strand, clusterIndex: cluster.clusterIndex })));
  return { clusters, rungs, connectors, emitters, structuralClusterCount: BACKBONE_CLUSTERS * 2, clusterBubbleCount: BACKBONE_CLUSTERS * 2 * CLUSTER_BUBBLES };
};

export const particlePosition = (index, total = 2800) => {
  const seed = ((index * 16807) % 2147483647) / 2147483647;
  const strand = index % 2;
  const cluster = Math.floor(seed * BACKBONE_CLUSTERS);
  const center = strandPoint(cluster, strand);
  const radius = 0.3 + (((index * 37) % 100) / 100) * 0.7;
  const angle = seed * Math.PI * 2;
  return [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle * 1.4) * radius, center[2] + Math.cos(angle * 1.7) * radius];
};

export const smokePosition = (index, total = 2600) => {
  const seed = ((index * 48271) % 2147483647) / 2147483647;
  const emitter = Math.floor(seed * (BACKBONE_CLUSTERS * 2));
  const strand = emitter % 2;
  const cluster = Math.floor(emitter / 2);
  const center = strandPoint(cluster, strand);
  const angle = seed * Math.PI * 2;
  const radius = 0.15 + (((index * 23) % 100) / 100) * 1.45;
  return [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(seed * 19) * radius * 1.6, center[2] + Math.sin(angle) * radius];
};
