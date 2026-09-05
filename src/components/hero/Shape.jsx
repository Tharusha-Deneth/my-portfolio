import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const Shape = () => {
    const { width } = useThree((state) => state.size);
    const isMobile = width < 768;

    return (
        <>
            <Sphere 
                args={[1, 100, 200]} 
                scale={isMobile ? 1.2 : 2.4}
                position={isMobile ? [0, -0.35, 0] : [0, 0, 0]}
            >
                <MeshDistortMaterial
                    color="#DB8B9B"
                    attach="material"
                    distort={0.45}
                    speed={1.8}
                />
            </Sphere>
            <ambientLight intensity={2} />
            <directionalLight position={[1, 2, 3]} />
        </>
    );
};

export default Shape;