export default function Backgroundwater() {
    return (
    <video
        autoPlay
        loop
        muted
        playsInline
        style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        }}
    >
        <source src="/image/water.mp4" type="video/mp4" />
        </video>
    );
}
