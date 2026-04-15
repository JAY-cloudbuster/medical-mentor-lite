import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, ContactShadows } from '@react-three/drei';
import GlassPanel from '../components/ui/GlassPanel';
import useAppStore from '../store/useAppStore';

// --- Procedural Human Anatomy Model ---
// This builds a proportional human mannequin using R3F primitives since we do not have external GLTF assets.
const ProceduralHumanBody = ({ gender, layers, setSelectedOrgan }) => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Gentle breathing animation on the torso if we wanted, but static is fine for clinical tools
    if (groupRef.current) {
        // slight idle float
        groupRef.current.position.y = -1.5 + Math.sin(t * 0.5) * 0.05;
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    if (e.object.material) {
        // Store original emissive if needed, but here we just toggle
        e.object.material.emissiveIntensity = 0.5;
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    if (e.object.material) {
        e.object.material.emissiveIntensity = 0;
    }
  };

  const handleClick = (e, organData) => {
    e.stopPropagation();
    setSelectedOrgan(organData);
  };

  // Materials based on layers
  const skinMaterial = { color: "#24204a", transparent: true, opacity: layers.muscular ? 0.3 : 0.8, wireframe: layers.skeletal };
  const genericMaterial = { roughness: 0.4, metalness: 0.1 };

  // Adjustments based on gender
  const isFemale = gender === 'female';
  const shoulderWidth = isFemale ? 0.7 : 0.85;
  const hipWidth = isFemale ? 0.55 : 0.45;
  const torsoHeight = 1.4;

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* --- MUSCULAR/SKELETAL EXTERIOR (The Mannequin) --- */}
      {(layers.muscular || layers.skeletal) && (
        <group>
          {/* Head & Neck */}
          <group position={[0, torsoHeight + 0.6, 0]}>
             {/* Head */}
            <mesh 
                position={[0, 0.4, 0]} 
                onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}
                onClick={(e) => handleClick(e, { name: 'Cranium', fact: 'The skull protecting the brain.', flow: '150 ml/m' })}
            >
              <sphereGeometry args={[0.35, 32, 32]} />
              <meshStandardMaterial {...skinMaterial} {...genericMaterial} emissive="#43f3f6" />
            </mesh>
            {/* Neck */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.15, 0.3]} />
              <meshStandardMaterial {...skinMaterial} {...genericMaterial} />
            </mesh>
          </group>

          {/* Torso */}
          <mesh 
            position={[0, torsoHeight / 2 + 0.5, 0]}
            onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, { name: 'Thorax', fact: 'Contains major respiratory and cardiovascular organs.', flow: 'Variable' })}
          >
            <cylinderGeometry args={[shoulderWidth / 2, hipWidth / 2, torsoHeight, 32]} />
            <meshStandardMaterial {...skinMaterial} {...genericMaterial} emissive="#ff50fc" />
          </mesh>

          {/* Arms */}
          {[-1, 1].map((side, i) => (
            <group key={i} position={[(shoulderWidth / 2 + 0.15) * side, torsoHeight + 0.3, 0]}>
               {/* Shoulder */}
               <mesh>
                  <sphereGeometry args={[0.18]} />
                  <meshStandardMaterial {...skinMaterial} {...genericMaterial} />
               </mesh>
               {/* Upper Arm */}
               <mesh position={[0.1 * side, -0.4, 0]} rotation={[0, 0, 0.1 * side]}>
                 <capsuleGeometry args={[0.12, 0.6]} />
                 <meshStandardMaterial {...skinMaterial} {...genericMaterial} />
               </mesh>
               {/* Lower Arm */}
               <mesh position={[0.2 * side, -1.1, 0.1]} rotation={[-0.1, 0, 0.1 * side]}>
                 <capsuleGeometry args={[0.1, 0.5]} />
                 <meshStandardMaterial {...skinMaterial} {...genericMaterial} />
               </mesh>
               {/* Hand */}
               <mesh position={[0.3 * side, -1.6, 0.15]} rotation={[-0.1, 0, 0.1 * side]}>
                 <boxGeometry args={[0.15, 0.25, 0.05]} />
                 <meshStandardMaterial {...skinMaterial} {...genericMaterial} />
               </mesh>
            </group>
          ))}

          {/* Pelvis/Hips */}
          <mesh position={[0, 0.4, 0]}>
            <capsuleGeometry args={[hipWidth / 2, 0.2]} />
            <meshStandardMaterial {...skinMaterial} {...genericMaterial} />
          </mesh>

          {/* Legs */}
          {[-1, 1].map((side, i) => (
            <group key={`leg-${i}`} position={[(hipWidth / 2 - 0.05) * side, 0.3, 0]}>
              {/* Upper Leg */}
              <mesh position={[0, -0.5, 0]} rotation={[0, 0, -0.05 * side]}>
                <capsuleGeometry args={[0.18, 0.8]} />
                <meshStandardMaterial {...skinMaterial} {...genericMaterial} />
              </mesh>
              {/* Knee */}
              <mesh position={[0, -1.1, 0]}>
                 <sphereGeometry args={[0.15]} />
                 <meshStandardMaterial {...skinMaterial} {...genericMaterial} />
              </mesh>
              {/* Lower Leg */}
              <mesh position={[0, -1.7, 0]} rotation={[0, 0, -0.02 * side]}>
                <capsuleGeometry args={[0.14, 0.8]} />
                <meshStandardMaterial {...skinMaterial} {...genericMaterial} />
              </mesh>
              {/* Foot */}
              <mesh position={[0, -2.25, 0.1]}>
                <boxGeometry args={[0.15, 0.1, 0.3]} />
                <meshStandardMaterial {...skinMaterial} {...genericMaterial} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* --- ORGANS (Internal structures) --- */}
      {layers.organs && (
        <group position={[0, torsoHeight / 2 + 0.5, 0]}>
          {/* Heart */}
          <mesh 
            position={[-0.08, 0.2, 0.1]} 
            rotation={[0, 0, 0.2]}
            onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, { name: 'Myocardium (Heart)', fact: 'Muscular organ ensuring perfusion to all tissues.', flow: '5 L/m (Cardiac Output)' })}
          >
             <sphereGeometry args={[0.15, 32, 32]} />
             <meshStandardMaterial color="#ff716c" emissive="#ff716c" emissiveIntensity={0.2} roughness={0.2} />
          </mesh>

          {/* Left Lung */}
          <mesh 
            position={[-0.18, 0.2, -0.05]} 
            rotation={[0, 0, 0.1]}
            onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, { name: 'Left Lung', fact: 'Provides gas exchange. Smaller to accommodate the heart.', flow: 'Pulmonary Circulation' })}
          >
             <capsuleGeometry args={[0.12, 0.4]} />
             <meshStandardMaterial color="#43f3f6" emissive="#43f3f6" emissiveIntensity={0.1} transparent opacity={0.6} />
          </mesh>

          {/* Right Lung */}
          <mesh 
             position={[0.18, 0.25, -0.05]} 
             rotation={[0, 0, -0.1]}
             onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}
             onClick={(e) => handleClick(e, { name: 'Right Lung', fact: 'Provides gas exchange. Contains three distinct lobes.', flow: 'Pulmonary Circulation' })}
          >
             <capsuleGeometry args={[0.14, 0.45]} />
             <meshStandardMaterial color="#43f3f6" emissive="#43f3f6" emissiveIntensity={0.1} transparent opacity={0.6} />
          </mesh>

          {/* Liver */}
          <mesh 
             position={[0.1, -0.2, 0.05]} 
             rotation={[0, 0, 0.2]}
             onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}
             onClick={(e) => handleClick(e, { name: 'Hepatic System (Liver)', fact: 'Metabolizes drugs and produces vital proteins.', flow: '1.5 L/m' })}
          >
             <capsuleGeometry args={[0.15, 0.3]} />
             <meshStandardMaterial color="#9f0519" emissive="#9f0519" emissiveIntensity={0.1} />
          </mesh>

          {/* Kidneys */}
          {[-1, 1].map((side, i) => (
             <mesh 
               key={i} 
               position={[0.15 * side, -0.35, -0.1]} 
               rotation={[0.2, 0, 0.1 * side]}
               onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}
               onClick={(e) => handleClick(e, { name: side === -1 ? 'Left Kidney' : 'Right Kidney', fact: 'Filters blood to produce urine, regulating electrolytes.', flow: '1.2 L/m (Both)' })}
             >
                <sphereGeometry args={[0.08]} />
                <meshStandardMaterial color="#bf81ff" emissive="#bf81ff" emissiveIntensity={0.2} />
             </mesh>
          ))}
        </group>
      )}

      {/* --- NERVOUS SYSTEM --- */}
      {layers.nervous && (
        <group>
          {/* Brain */}
          <mesh 
             position={[0, torsoHeight + 1.05, 0]}
             onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}
             onClick={(e) => handleClick(e, { name: 'Cerebrum (Brain)', fact: 'The command center of the central nervous system.', flow: '750 ml/m' })}
          >
             <icosahedronGeometry args={[0.25, 3]} />
             <meshStandardMaterial color="#bf81ff" emissive="#bf81ff" emissiveIntensity={0.5} wireframe />
          </mesh>
          
          {/* Spinal Cord */}
          <mesh 
             position={[0, torsoHeight / 2 + 0.5, -0.1]}
             onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}
             onClick={(e) => handleClick(e, { name: 'Spinal Cord', fact: 'Carries motor and sensory signals between brain and body.', flow: 'CNS Component' })}
          >
             <cylinderGeometry args={[0.03, 0.03, torsoHeight + 0.4]} />
             <meshStandardMaterial color="#bf81ff" emissive="#bf81ff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};

const AnatomyVisualizer = () => {
  const { selectedGender, setSelectedGender, anatomyLayer, toggleAnatomyLayer, selectedOrgan, setSelectedOrgan } = useAppStore();

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 pointer-events-auto bg-background">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color={selectedGender === 'male' ? "#43f3f6" : "#ff50fc"} />
          <pointLight position={[-10, -10, -10]} intensity={1.2} color="#bf81ff" />
          
          <Suspense fallback={<Html center><div className="text-primary font-headline animate-pulse whitespace-nowrap">Rendering Biological Matrix...</div></Html>}>
              <ProceduralHumanBody gender={selectedGender} layers={anatomyLayer} setSelectedOrgan={setSelectedOrgan} />
              <ContactShadows position={[0, -3.8, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
              <Environment preset="city" />
          </Suspense>

          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 4}
            autoRotate={!selectedOrgan} 
            autoRotateSpeed={0.5} 
          />
        </Canvas>
      </div>

      {/* Floating Navigation Controls */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto z-30">
        <GlassPanel className="p-1 rounded-full flex items-center gap-1 shadow-2xl">
            <button 
                onClick={() => setSelectedGender('female')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedGender === 'female' ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(67,243,246,0.3)]' : 'text-on-surface-variant hover:text-white'}`}
            >
                Female Type
            </button>
            <button 
                onClick={() => setSelectedGender('male')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedGender === 'male' ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(67,243,246,0.3)]' : 'text-on-surface-variant hover:text-white'}`}
            >
                Male Type
            </button>
        </GlassPanel>
      </div>

      {/* Left Side Panel: Layer Toggles */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-72 glass-panel ghost-border rounded-2xl p-6 shadow-2xl flex flex-col gap-6 z-30 pointer-events-auto hidden md:flex">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface mb-1">Anatomy Layers</h2>
          <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">Neural Interface v4.0</p>
        </div>
        
        <div className="space-y-4">
          <div onClick={() => toggleAnatomyLayer('skeletal')} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40 ghost-border group cursor-pointer hover:bg-surface-container-high/60 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${anatomyLayer.skeletal ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-500'} flex items-center justify-center transition-colors`}>
                <span className="material-symbols-outlined text-xl">skull</span>
              </div>
              <span className={`font-medium text-sm ${anatomyLayer.skeletal ? 'text-white' : 'text-slate-400'}`}>Skeletal View</span>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${anatomyLayer.skeletal ? 'bg-primary shadow-[0_0_8px_rgba(67,243,246,0.4)]' : 'bg-surface-container-highest border border-outline-variant'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${anatomyLayer.skeletal ? 'bg-white right-1' : 'bg-outline left-1'}`}></div>
            </div>
          </div>
          
          <div onClick={() => toggleAnatomyLayer('muscular')} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40 ghost-border group cursor-pointer hover:bg-surface-container-high/60 transition-all">
            <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-lg ${anatomyLayer.muscular ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-slate-500'} flex items-center justify-center transition-colors`}>
                <span className="material-symbols-outlined text-xl">fitness_center</span>
              </div>
              <span className={`font-medium text-sm ${anatomyLayer.muscular ? 'text-white' : 'text-slate-400'}`}>Muscular Map</span>
            </div>
             <div className={`w-10 h-5 rounded-full relative transition-colors ${anatomyLayer.muscular ? 'bg-secondary shadow-[0_0_8px_rgba(255,80,252,0.4)]' : 'bg-surface-container-highest border border-outline-variant'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${anatomyLayer.muscular ? 'bg-white right-1' : 'bg-outline left-1'}`}></div>
            </div>
          </div>
          
          <div onClick={() => toggleAnatomyLayer('nervous')} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40 ghost-border group cursor-pointer hover:bg-surface-container-high/60 transition-all">
             <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-lg ${anatomyLayer.nervous ? 'bg-tertiary/20 text-tertiary' : 'bg-white/5 text-slate-500'} flex items-center justify-center transition-colors`}>
                <span className="material-symbols-outlined text-xl">electric_bolt</span>
              </div>
              <span className={`font-medium text-sm ${anatomyLayer.nervous ? 'text-white' : 'text-slate-400'}`}>Nervous System</span>
            </div>
             <div className={`w-10 h-5 rounded-full relative transition-colors ${anatomyLayer.nervous ? 'bg-tertiary shadow-[0_0_8px_rgba(191,129,255,0.4)]' : 'bg-surface-container-highest border border-outline-variant'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${anatomyLayer.nervous ? 'bg-white right-1' : 'bg-outline left-1'}`}></div>
            </div>
          </div>

          <div onClick={() => toggleAnatomyLayer('organs')} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/40 ghost-border group cursor-pointer hover:bg-surface-container-high/60 transition-all">
             <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-lg ${anatomyLayer.organs ? 'bg-error/20 text-error' : 'bg-white/5 text-slate-500'} flex items-center justify-center transition-colors`}>
                <span className="material-symbols-outlined text-xl">favorite</span>
              </div>
              <span className={`font-medium text-sm ${anatomyLayer.organs ? 'text-white' : 'text-slate-400'}`}>Vital Organs</span>
            </div>
             <div className={`w-10 h-5 rounded-full relative transition-colors ${anatomyLayer.organs ? 'bg-error shadow-[0_0_8px_rgba(255,113,108,0.4)]' : 'bg-surface-container-highest border border-outline-variant'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${anatomyLayer.organs ? 'bg-white right-1' : 'bg-outline left-1'}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel: Detail Card */}
      {selectedOrgan && (
        <GlassPanel className="absolute right-8 top-1/2 -translate-y-1/2 w-80 ghost-border rounded-2xl p-6 shadow-2xl z-30 pointer-events-auto hidden xl:block relative overflow-hidden animate-in slide-in-from-right-8 duration-500 fade-in">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <button onClick={() => setSelectedOrgan(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full p-1">
                 <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <div className="flex justify-between items-start mb-6 pt-2">
            <div>
                <h4 className="text-xs font-bold text-primary tracking-widest uppercase mb-1">Detailed Scan</h4>
                <h1 className="font-headline text-3xl font-bold text-on-surface">{selectedOrgan.name}</h1>
            </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                {selectedOrgan.fact}
            </p>
            <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-tighter text-outline font-bold">Diagnostics</span>
                <div className="flex items-center gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                <span>Status: Optimal Functionality</span>
                </div>
            </div>
            
            <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-on-surface-variant">Functional Capacity</span>
                <span className="text-xs font-bold text-primary">98%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary w-[98%]"></div>
                </div>
            </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
            <div className="glass-panel ghost-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-outline uppercase mb-1">Blood Flow</span>
                <span className="text-lg font-headline font-bold text-on-surface whitespace-nowrap overflow-hidden text-ellipsis w-full">{selectedOrgan.flow}</span>
            </div>
            <div className="glass-panel ghost-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-outline uppercase mb-1">Oxygen Use</span>
                <span className="text-lg font-headline font-bold text-on-surface">Auto</span>
            </div>
            </div>
            
            <button className="w-full py-4 bg-surface-variant/40 hover:bg-surface-variant/60 ghost-border rounded-xl text-on-surface font-bold text-sm flex items-center justify-center gap-3 transition-all group">
               <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">biotech</span>
               Analyze Pathology
            </button>
        </GlassPanel>
      )}

      {/* Dynamic Hover Prompt */}
      {!selectedOrgan && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 px-6 py-2 glass-panel ghost-border rounded-full shadow-lg z-30 pointer-events-none">
            <p className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm animate-pulse text-primary">info</span>
            Interact with biological elements to scan
            </p>
        </div>
      )}
    </div>
  );
};

export default AnatomyVisualizer;
