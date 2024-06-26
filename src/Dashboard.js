import React, { useState } from 'react';
import { fetchBoards, fetchSprint, summarizeSprint, fetchLatestSprintFromDB } from './api';
import {
    AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, CardActions,
    Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Snackbar, CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Alert } from '@mui/material';

const Dashboard = ({ token }) => {
    const [boards, setBoards] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const handleFetchBoards = async () => {
        setLoading(true);
        try {
            const data = await fetchBoards(token);
            if (Array.isArray(data)) {
                setBoards(data);
            } else {
                setError('No boards found or data format is incorrect');
                console.error('Boards data format is incorrect:', data);
            }
        } catch (err) {
            setError('Failed to fetch boards');
            console.error('Error fetching boards:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchSprint = async (boardId) => {
        setLoading(true);
        try {
            const data = await fetchSprint(token, boardId);
            if (data && data.sprint) {
                setSprints([data.sprint]);
                setSuccess('Sprint data fetched successfully');
            } else {
                setError('No sprint found or data format is incorrect');
                console.error('Sprint data format is incorrect:', data);
            }
        } catch (err) {
            setError('Failed to fetch sprint');
            console.error('Error fetching sprint:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchLatestSprintFromDB = async (boardId) => {
        setLoading(true);
        try {
            const data = await fetchLatestSprintFromDB(token, boardId);
            if (data) {
                setSprints([data]);
                setSuccess('Sprint data fetched from DB successfully');
            } else {
                setError('No sprint data found in DB');
                console.error('No sprint data found in DB:', data);
            }
        } catch (err) {
            setError('Failed to fetch sprint from DB');
            console.error('Error fetching sprint from DB:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSummarizeSprint = async (sprint) => {
        setLoading(true);
        try {
            const summaryData = await summarizeSprint(token, sprint);
            if (summaryData && summaryData.summary_ai) {
                setSprints(prevSprints =>
                    prevSprints.map(s =>
                        s.name === sprint.name ? { ...s, summary_ai: summaryData.summary_ai } : s
                    )
                );
                setSuccess('Sprint summarized successfully');
            } else {
                setError('Failed to generate summary or data format is incorrect');
                console.error('Summary data format is incorrect:', summaryData);
            }
        } catch (err) {
            setError('Failed to summarize sprint');
            console.error('Error summarizing sprint:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container sx={{ marginTop: 4 }}>
                <Button variant="contained" color="primary" onClick={handleFetchBoards} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Fetch Boards'}
                </Button>
                {boards.length > 0 && (
                    <Grid container spacing={3} sx={{ marginTop: 2 }}>
                        {boards.map(board => (
                            <Grid item xs={12} md={6} key={board.id}>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>{board.name}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Button variant="contained" color="secondary" onClick={() => handleFetchSprint(board.id)} disabled={loading}>
                                            {loading ? <CircularProgress size={24} /> : 'Fetch Sprint'}
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => handleFetchLatestSprintFromDB(board.id)} disabled={loading}>
                                            {loading ? <CircularProgress size={24} /> : 'Fetch Latest Sprint from DB'}
                                        </Button>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        ))}
                    </Grid>
                )}
                {sprints.length > 0 && (
                    <Container sx={{ marginTop: 4 }}>
                        <Typography variant="h5" gutterBottom>Sprints</Typography>
                        <Grid container spacing={3}>
                            {sprints.map(sprint => (
                                <Grid item xs={12} md={6} key={sprint.name}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">{sprint.name}</Typography>
                                            <List>
                                                {sprint.tickets.map(ticket => (
                                                    <ListItem key={ticket.key}>
                                                        <ListItemText
                                                            primary={`${ticket.key}: ${ticket.summary}`}
                                                            secondary={`Status: ${ticket.status}`}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <Button variant="contained" color="primary" onClick={() => handleSummarizeSprint(sprint)} disabled={loading}>
                                                {loading ? <CircularProgress size={24} /> : 'Summarize'}
                                            </Button>
                                            <Typography variant="h6" sx={{ marginTop: 2 }}>Summary</Typography>
                                            <Typography>{sprint.summary_ai}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                )}
                <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
                <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>
            </Container>
        </Container>
    );
};

export default Dashboard;