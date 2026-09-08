import ComputerModelContainer from "./computer/ComputerModelContainer";
import ConsoleModelContainer from "./console/ConsoleModelContainer";
import Counter from "./Counter";
import MugModelContainer from "./mug/MugModelContainer";
import "./services.css";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

const textVariants = {
    initial: {
        x: -50,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

const listVariants = {
    initial: {
        x: -50,
        opacity: 0,
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.1,
        },
    },
};

const modelVariants = {
    initial: {
        opacity: 0,
        scale: 0.9,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

const services = [
    {
        id: 1,
        img: "/service1.png",
        title: "Full Stack Web Development",
        counter: 15,
    },
    {
        id: 2,
        img: "/service2.png",
        title: "Mobile App Development",
        counter: 10,
    },
    {
        id: 3,
        img: "/service3.png",
        title: "Backend & Database Systems",
        counter: 20,
    },
];

const Services = () => {
    const [currentServiceId, setCurrentServiceId] = useState(1);
    const ref = useRef();
    const isInView = useInView(ref, { margin: "-100px" });

    return (
        <div className="services" ref={ref}>
            <div className="sSection left">
                <motion.h1
                    variants={textVariants}
                    animate={isInView ? "animate" : "initial"}
                    className="sTitle"
                >
                    What I Do?
                </motion.h1>
                <motion.div
                    variants={listVariants}
                    animate={isInView ? "animate" : "initial"}
                    className="serviceList"
                >
                    {services.map((service) => (
                        <motion.div
                            variants={listVariants}
                            className="service"
                            key={service.id}
                            onClick={() => setCurrentServiceId(service.id)}
                        >
                            <div className="serviceIcon">
                                <img src={service.img} alt="" />
                            </div>
                            <div className="serviceInfo">
                                <h2>{service.title}</h2>
                                <h3>{service.counter}+ Projects</h3>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div 
                    variants={listVariants} 
                    animate={isInView ? "animate" : "initial"} 
                    className="counterList"
                >
                    <Counter from={0} to={45} text="Projects Completed" />
                    <Counter from={0} to={30} text="Happy Clients" />
                </motion.div>
            </div>
            
            <motion.div 
                className="sSection right"
                variants={modelVariants}
                initial="initial"
                animate={isInView ? "animate" : "initial"}
            >
                <motion.div 
                    key={currentServiceId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ width: "100%", height: "100%" }}
                >
                    {currentServiceId === 1 ? (
                        <ComputerModelContainer />
                    ) : currentServiceId === 2 ? (
                        <MugModelContainer />
                    ) : (
                        <ConsoleModelContainer />
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Services;