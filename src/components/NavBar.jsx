import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap';

export default function NavigationBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const {data} = await supabase.auth.getUser();
            const currentUser = data?.user || null;
            setUser(currentUser);

            if (currentUser) {
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", currentUser.id)
                    .single();
                
                if (profileData) {
                    setProfile(profileData);
                }
            }
        };
        getUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            if (!session?.user) setProfile(null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate("/p79");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/p79/dashboard?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
            <Container fluid className="px-4">
                <Navbar.Brand 
                    as={Link} 
                    to={user ? "/p79/dashboard" : "/p79"}
                    className="fw-bold fs-5"
                >
                    Gaming Library Tracker
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center gap-3">
                        {user ? (
                            <>
                                <Nav.Link 
                                    as={Link}
                                    to="/p79/profile"
                                    className="d-flex align-items-center gap-2 text-white"
                                >
                                    <div 
                                        className="rounded-circle d-flex justify-content-center align-items-center fw-bold text-white text-uppercase"
                                        style={{
                                            width: "35px",
                                            height: "35px",
                                            backgroundColor: profile?.avatar_color || "#3d9ad7"
                                        }}
                                    >
                                        {user.user_metadata?.username
                                            ? user.user_metadata.username[0]
                                            : user.email[0]}
                                    </div>
                                    <span className="small">
                                        {user.user_metadata?.username || user.email}
                                    </span>
                                </Nav.Link>

                                <Button 
                                    variant="info"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/p79/login" className="text-white">
                                    Log in
                                </Nav.Link>
                                <Nav.Link as={Link} to="/p79/signup" className="text-white">
                                    Sign up
                                </Nav.Link>
                            </>
                        )}

                        <Form onSubmit={handleSearch} className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Search games..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="sm"
                                aria-label="Search games"
                            />
                        </Form>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}