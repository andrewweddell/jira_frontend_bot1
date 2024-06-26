import React, { useState } from 'react';
import { fetchBoards, fetchSprint, summarizeSprint, fetchLatestSprintFromDB } from './api';
import {
    Button, Accordion, AccordionSummary, AccordionDetails,
    Typography, Card, CardContent, CardHeader, List, ListItem, ListItemText, Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Dashboard = ({ token }) => {
    const [boards, setBoards] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [error, setError] = useState(null);

    const handleFetchBoards = async () => {
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
        }
    };

    const handleFetchSprint = async (boardId) => {
        try {
            const data = await fetchSprint(token, boardId);
            if (data && data.sprint) {
                setSprints([data.sprint]);
            } else {
                setError('No sprint found or data format is incorrect');
                console.error('Sprint data format is incorrect:', data);
            }
        } catch (err) {
            setError('Failed to fetch sprint');
            console.error('Error fetching sprint:', err);
        }
    };

    const handleFetchLatestSprintFromDB = async (boardId) => {
        try {
            const data = await fetchLatestSprintFromDB(token, boardId);
            if (data) {
                setSprints([data]);
            } else {
                setError('No sprint data found in DB');
                console.error('No sprint data found in DB:', data);
            }
        } catch (err) {
            setError('Failed to fetch sprint from DB');
            console.error('Error fetching sprint from DB:', err);
        }
    };

    const handleSummarizeSprint = async (sprint) => {
        try {
            const summaryData = await summarizeSprint(token, sprint);
            if (summaryData && summaryData.summary_ai) {
                setSprints(prevSprints =>
                    prevSprints.map(s =>
                        s.name === sprint.name ? { ...s, summary_ai: summaryData.summary_ai } : s
                    )
                );
            } else {
                setError('Failed to generate summary or data format is incorrect');
                console.error('Summary data format is incorrect:', summaryData);
            }
        } catch (err) {
            setError('Failed to summarize sprint');
            console.error('Error summarizing sprint:', err);
        }
    };

    return (
        <div>
            <Typography variant="h2" gutterBottom>Dashboard</Typography>
            <Button variant="contained" color="primary" onClick={handleFetchBoards}>Fetch Boards</Button>
            {boards.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    {boards.map(board => (
                        <Accordion key={board.id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>{board.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Button variant="contained" color="secondary" onClick={() => handleFetchSprint(board.id)}>Fetch Sprint</Button>
                                <Button variant="contained" color="secondary" onClick={() => handleFetchLatestSprintFromDB(board.id)}>Fetch Latest Sprint from DB</Button>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            )}
            {sprints.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h3" gutterBottom>Sprints</Typography>
                    <Grid container spacing={3}>
                        {sprints.map(sprint => (
                            <Grid item xs={12} md={6} key={sprint.name}>
                                <Card>
                                    <CardHeader title={sprint.name} />
                                    <CardContent>
                                        <Typography variant="h6">Tickets</Typography>
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
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSummarizeSprint(sprint)}
                                        >
                                            Summarize
                                        </Button>
                                        <Typography variant="h6">Summary</Typography>
                                        <Typography>{sprint.summary_ai}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}
            {error && <Typography color="error">{error}</Typography>}
        </div>
    );
};

export default Dashboard;