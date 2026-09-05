import { TypeAnimation } from "react-type-animation";

const Speech = () => {
    return (
        <div className="bubbleContainer">
            <div className="bubble">
                <TypeAnimation
                    sequence={[
                        1000,
                        "Hi, I'm Tharusha Deneth. Full Stack Software Engineer.",
                        1000,
                        "Building robust web and mobile applications with modern technologies.",
                        1000,
                        "Passionate about writing clean code and solving complex problems.",
                        1000,
                    ]}
                    wrapper="span"
                    speed={40}
                    deletionSpeed={60}
                    // omitDeletionAnimation
                    repeat={Infinity}
                    className="bubble-text"
                />
            </div>
            <img src="/man.png" alt="" />
        </div>
    );
};

export default Speech;