import Skeleton from "@mui/material/Skeleton";

const UniversalSkeleton = ({
    type = "rectangular", 
    width = "100%",
    height = "1rem",
    animation = "wave", 
    count = 1,
    className = "",
    light = true,
}) => {
    const lightStyles = light
        ? {
            backgroundColor: "#f3f4f6", // base color (light gray)
            "&::after": {
                background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            },
        }
        : {};

    return (
        <div className={className}>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton
                    key={index}
                    variant={type}
                    animation={animation}
                    width={width}
                    height={height}
                    className={className}
                    sx={lightStyles} // 👈 apply custom light color
                />
            ))}
        </div>
    );
};

export default UniversalSkeleton;

