interface ICustomErrorProps {
    title?: string
    description?: string
}

export default function CustomError(props: ICustomErrorProps) {
    return (
        <div>
            <div style={{ textAlign:"center", fontSize:"3rem", fontWeight:"bold" }}>{props.title || "Plain Card"}</div>
            <div style={{ textAlign:"center" }}>{props.description || "This is a simple content preview inside the PlainCard."}</div>
        </div>
    );
}