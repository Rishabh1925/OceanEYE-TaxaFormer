import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Globe, MapPin, Layers, Satellite, Navigation, Dna, Waves, Fish, Microscope } from 'lucide-react';
import CardSwap, { Card } from './CardSwap';

interface MapPageProps {
  isDarkMode: boolean;
  onNavigate: (page: string) => void;
}

// Fix for default marker icon issue in Leaflet with bundlers
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

// Inject Leaflet CSS
const injectLeafletCSS = () => {
  if (typeof document === 'undefined') return;
  
  const existingLink = document.getElementById('leaflet-css');
  if (existingLink) return;
  
  const link = document.createElement('link');
  link.id = 'leaflet-css';
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
  link.integrity = 'sha512-h9FcoyWjHcOcmEVkxOfTLnmZFWIH0iZhZT1H2TbOq55xssQGEJHEaIm+PgoUaZbRvQTNTluNOEfb1ZRy6D3BOw==';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

export default function MapPage({ isDarkMode, onNavigate }: MapPageProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'ocean'>('satellite');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  const sampleLocations = [
    { id: 1, name: 'Pacific Deep Sea', lat: 35.6, lon: -125.3, samples: 142, diversity: 'High' },
    { id: 2, name: 'Coral Triangle', lat: -5.5, lon: 122.8, samples: 198, diversity: 'Very High' },
    { id: 3, name: 'Mediterranean Basin', lat: 36.2, lon: 14.5, samples: 87, diversity: 'Medium' },
    { id: 4, name: 'Great Barrier Reef', lat: -18.2, lon: 147.7, samples: 234, diversity: 'Very High' },
    { id: 5, name: 'Caribbean Sea', lat: 18.5, lon: -78.3, samples: 156, diversity: 'High' },
    { id: 6, name: 'Red Sea', lat: 22.0, lon: 38.5, samples: 103, diversity: 'High' },
  ];

  const featureCards = [
    {
      title: 'DNA Sequencing',
      icon: Dna,
      description: 'Advanced eDNA extraction and sequencing from environmental samples',
      stats: [
        { label: 'Sequences', value: '1.2M+' },
        { label: 'Accuracy', value: '99.8%' },
        { label: 'Processing', value: '< 24h' }
      ],
      color: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Ocean Mapping',
      icon: Waves,
      description: 'Real-time biodiversity mapping across global marine ecosystems',
      stats: [
        { label: 'Locations', value: '47' },
        { label: 'Coverage', value: '2.3M km²' },
        { label: 'Depth', value: '0-6000m' }
      ],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Species Detection',
      icon: Fish,
      description: 'AI-powered taxonomic classification using Nucleotide Transformer',
      stats: [
        { label: 'Species', value: '1,284' },
        { label: 'Phyla', value: '23' },
        { label: 'Database', value: 'PR2+SILVA' }
      ],
      color: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Analysis Tools',
      icon: Microscope,
      description: 'Comprehensive biodiversity analysis and pattern recognition',
      stats: [
        { label: 'Samples', value: '661' },
        { label: 'Countries', value: '23' },
        { label: 'Projects', value: '18' }
      ],
      color: 'from-purple-500 to-pink-600'
    }
  ];

  useEffect(() => {
    injectLeafletCSS();
    
    if (!mapContainerRef.current || mapRef.current) return;

    fixLeafletIcon();

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2.5,
      zoomControl: true,
      attributionControl: true,
    });

    mapRef.current = map;

    L.tileLayer(
      `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=QsZKOKkMJ38YEDyWChsA`,
      {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>',
        crossOrigin: true,
      }
    ).addTo(map);

    const biodiversityIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    sampleLocations.forEach((location) => {
      const marker = L.marker([location.lat, location.lon], {
        icon: biodiversityIcon,
      }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1e293b;">
            ${location.name}
          </h3>
          <div style="font-size: 14px; color: #475569; margin-bottom: 4px;">
            <strong>Coordinates:</strong> ${location.lat.toFixed(2)}°, ${location.lon.toFixed(2)}°
          </div>
          <div style="font-size: 14px; color: #475569; margin-bottom: 4px;">
            <strong>Samples:</strong> ${location.samples}
          </div>
          <div style="font-size: 14px;">
            <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; ${
              location.diversity === 'Very High'
                ? 'background: rgba(34, 197, 94, 0.2); color: #16a34a;'
                : location.diversity === 'High'
                ? 'background: rgba(59, 130, 246, 0.2); color: #2563eb;'
                : 'background: rgba(234, 179, 8, 0.2); color: #ca8a04;'
            }">
              ${location.diversity} Diversity
            </span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('mouseover', function () {
        this.openPopup();
      });
    });

    sampleLocations.forEach((location) => {
      L.circle([location.lat, location.lon], {
        color: '#06b6d4',
        fillColor: '#06b6d4',
        fillOpacity: 0.1,
        radius: 500000,
        weight: 2,
      }).addTo(map);
    });

    setIsMapLoaded(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleLayerChange = (layer: 'satellite' | 'ocean') => {
    setActiveLayer(layer);
    
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapRef.current?.removeLayer(layer);
        }
      });

      const tileUrl = layer === 'satellite'
        ? `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=QsZKOKkMJ38YEDyWChsA`
        : `https://api.maptiler.com/maps/ocean/{z}/{x}/{y}.png?key=QsZKOKkMJ38YEDyWChsA`;

      L.tileLayer(tileUrl, {
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
        crossOrigin: true,
      }).addTo(mapRef.current);
    }
  };

  const flyToLocation = (lat: number, lon: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lon], 6, {
        duration: 1.5,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className={`text-3xl md:text-4xl mb-3 font-bold ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Global Biodiversity Map
          </h1>
          <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time visualization of eDNA samples and biodiversity patterns across the globe
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className={`rounded-xl p-6 ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-4">
                <Globe className={`w-6 h-6 ${isDarkMode ? 'text-cyan-400' : 'text-blue-500'}`} />
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Interactive Mapping
                </h2>
                {isMapLoaded && (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                    Live
                  </span>
                )}
              </div>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Explore marine biodiversity through advanced eDNA analysis and AI-powered classification. 
                Our Nucleotide Transformer model processes environmental DNA samples to map species distribution 
                across oceanic regions using PR2+SILVA reference databases.
              </p>
              
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleLayerChange('satellite')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${
                    activeLayer === 'satellite'
                      ? isDarkMode
                        ? 'bg-cyan-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Satellite className="w-4 h-4" />
                  Satellite View
                </button>
                <button
                  onClick={() => handleLayerChange('ocean')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${
                    activeLayer === 'ocean'
                      ? isDarkMode
                        ? 'bg-cyan-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  Ocean View
                </button>
              </div>
            </div>

            <div className={`rounded-xl p-6 ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-md`}>
              <h3 className={`text-lg mb-4 font-bold flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                <MapPin className="w-5 h-5" />
                Sample Locations
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {sampleLocations.map(location => (
                  <button
                    key={location.id}
                    onClick={() => flyToLocation(location.lat, location.lon)}
                    className={`w-full text-left p-3 rounded-lg ${
                      isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-100/50 hover:bg-slate-100'
                    } transition-all`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {location.name}
                      </h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        location.diversity === 'Very High'
                          ? 'bg-green-500/20 text-green-400'
                          : location.diversity === 'High'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {location.diversity}
                      </span>
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {location.samples} samples
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-xl p-6 ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-md`}>
              <h3 className={`text-lg mb-4 font-bold flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                <Layers className="w-5 h-5" />
                Map Layers
              </h3>
              <div className="space-y-2">
                {['Sample Locations', 'Biodiversity Hotspots', 'Depth Zones', 'Taxonomic Groups'].map((layer, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-100/50 hover:bg-slate-100'
                    } transition-all`}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={idx === 0}
                      className="w-4 h-4 rounded"
                    />
                    <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {layer}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <h4 className={`text-sm mb-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Filter by Taxa
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Arthropoda', 'Mollusca', 'Cnidaria', 'Chordata', 'All'].map((taxa, idx) => (
                    <button
                      key={idx}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        idx === 4
                          ? isDarkMode
                            ? 'bg-cyan-600 text-white'
                            : 'bg-blue-600 text-white'
                          : isDarkMode
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {taxa}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className={`rounded-xl overflow-hidden ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-md shadow-xl mb-6`}>
              <div 
                ref={mapContainerRef}
                className="w-full h-[600px]"
                style={{ background: isDarkMode ? '#1e293b' : '#f1f5f9' }}
              />
            </div>

            <div style={{ height: '600px', position: 'relative' }}>
              <CardSwap
                cardDistance={50}
                verticalDistance={60}
                delay={4000}
                pauseOnHover={true}
                width={420}
                height={320}
              >
                {featureCards.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={idx} customClass={!isDarkMode ? 'light-mode' : ''}>
                      <div className="p-6 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-500/20 text-blue-600'
                          }`}>
                            Feature {idx + 1}
                          </span>
                        </div>
                        
                        <h3 className={`text-xl font-bold mb-2 ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {feature.title}
                        </h3>
                        
                        <p className={`text-sm mb-4 flex-grow ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {feature.description}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/50">
                          {feature.stats.map((stat, statIdx) => (
                            <div key={statIdx}>
                              <div className={`text-lg font-bold ${
                                isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                              }`}>
                                {stat.value}
                              </div>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-slate-500' : 'text-slate-500'
                              }`}>
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })};
              </CardSwap>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Samples', value: '661', icon: MapPin },
            { label: 'Locations', value: '47', icon: Globe },
            { label: 'Species', value: '1,284', icon: Layers },
            { label: 'Countries', value: '23', icon: Globe }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-5 text-center ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
              } backdrop-blur-md`}
            >
              <stat.icon className={`w-7 h-7 mx-auto mb-2 ${
                isDarkMode ? 'text-cyan-400' : 'text-blue-500'
              }`} />
              <div className={`text-2xl font-bold mb-1 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {stat.value}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
