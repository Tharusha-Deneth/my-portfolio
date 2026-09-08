import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { MugModel } from "./MugModel";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

const MugModelContainer = () => {
    return (
        <Canvas>
            <Suspense fallback={null}>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} />
                <MugModel scale={0.17} position={[0, -0.4, 0]} />
                <OrbitControls enableZoom={false} autoRotate />
                <PerspectiveCamera position={[0, -1, 2]} zoom={0.7} makeDefault />
            </Suspense>
        </Canvas>
    );
};

export default MugModelContainer;