import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

export default function GameCard({ game }) {
    const navigate = useNavigate();

    return (
        <Card 
            onClick={() => navigate(`/p79/gamedetail/${game.id}`)}
            className="h-100 game-card"
            style={{ cursor: 'pointer', backgroundColor: '#142236' }}
        >
            {game.background_image && (
                <Card.Img 
                    variant="top" 
                    src={game.background_image}
                    alt={game.name}
                    style={{ height: "150px", objectFit: "cover" }}
                />
            )}
            <Card.Body className="p-3">
                <Card.Title className="h5 mb-0 text-white">
                    {game.name}
                </Card.Title>
            </Card.Body>
        </Card>
    );
}