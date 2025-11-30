import { useEffect, useState } from "react";
import { fetchGames, searchGames } from "../services/rawgApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import GameCard from "../components/GameCard";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";

export default function Dashboard() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalGames, setTotalGames] = useState(0);
    
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";
    const navigate = useNavigate();
    const pageSize = 40;
    const maxButtons = 10;

    useEffect(() => {
        const loadGames = async () => {
            setLoading(true);
            setError(null);
            try {
                let data;
                if (searchQuery) {
                    data = await searchGames(searchQuery, page, pageSize);
                } else {
                    data = await fetchGames(page, pageSize);
                }

                setGames(data.results || []);
                setTotalGames(data.count || 0);
                const pages = data.count ? Math.ceil(data.count / pageSize) : 1;
                setTotalPages(pages);
            } catch (err) {
                console.error(err);
                setError("Failed to load games");
            } finally {
                setLoading(false);
            }
        };

        loadGames();
    }, [page, searchQuery]);

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const getPageNumbers = () => {
        const pages = [];
        let start = Math.max(page - Math.floor(maxButtons / 2), 1);
        let end = start + maxButtons - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(end - maxButtons + 1, 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (loading) {
        return (
            <div className="page-bg-primary">
                <Navbar />
                <Container className="py-3">
                    <p className="text-white">Loading games...</p>
                </Container>
            </div>
        );
    }

    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="page-bg-primary">
            <Navbar />

            <Container fluid className="px-4 py-3">
                <h1 className="text-white">Game Dashboard</h1>
                <div className="pt-2">
                    <p className="text-white">
                        Total games: {totalGames.toLocaleString()}
                    </p>
                </div>

                <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                    {games.map((game) => (
                        <Col key={game.id}>
                            <GameCard game={game} />
                        </Col>
                    ))}
                </Row>

                <div className="pagination-container">
                    <Button 
                        className="pagination-btn"
                        onClick={() => setPage(1)} 
                        disabled={page === 1}
                    >
                        First
                    </Button>

                    <Button 
                        className="pagination-btn"
                        onClick={handlePrev} 
                        disabled={page === 1}
                    >
                        Prev
                    </Button>

                    {getPageNumbers().map((p) => (
                        <Button 
                            key={p} 
                            className={page === p ? "pagination-btn pagination-btn-active" : "pagination-btn"}
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </Button>
                    ))}

                    {totalPages > maxButtons &&
                        page < totalPages - Math.floor(maxButtons / 2) && (
                        <span className="text-white mx-2">...</span>
                    )}

                    <Button 
                        className="pagination-btn"
                        onClick={handleNext} 
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>

                    <Button 
                        className="pagination-btn"
                        onClick={() => setPage(totalPages)} 
                        disabled={page === totalPages}
                    >
                        Last
                    </Button>
                </div>
            </Container>
        </div>
    );
}