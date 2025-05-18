import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export function UserProfile() {
    const { state: authState } = useAuth();
    const { state } = useApp();

    if (!authState.currentUser) {
        return null;
    }

    const userShifts = state.shifts.filter(shift => shift.userId === authState.currentUser.id);
    const userPenalties = state.penalties.filter(penalty => penalty.userId === authState.currentUser.id);
    const totalEarnings = userShifts.reduce((sum, shift) => sum + shift.earnings, 0);
    const totalPenalties = userPenalties.reduce((sum, penalty) => sum + penalty.amount, 0);

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {authState.currentUser.firstName} {authState.currentUser.lastName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    Логин: {authState.currentUser.login}
                </Typography>
                <Typography color="textSecondary">
                    Статус: {authState.currentUser.isAdmin ? 'Администратор' : 'Пользователь'}
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Статистика
                            </Typography>
                            <Typography>
                                Всего заработано: {totalEarnings} ₽
                            </Typography>
                            <Typography>
                                Всего штрафов: {totalPenalties} ₽
                            </Typography>
                            <Typography>
                                Чистый заработок: {totalEarnings - totalPenalties} ₽
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Назначенные парковки
                            </Typography>
                            <List>
                                {authState.currentUser.assignedParkings.map(parkingId => {
                                    const parking = state.parkings.find(p => p.id === parkingId);
                                    if (!parking) return null;
                                    return (
                                        <React.Fragment key={parking.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={parking.name}
                                                    secondary={
                                                        <>
                                                            Yandex: {parking.currentYandex}/{parking.requiredYandex}
                                                            <br />
                                                            SunRent: {parking.currentSunRent}/{parking.requiredSunRent}
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Последние смены
                            </Typography>
                            <List>
                                {userShifts.slice(-5).reverse().map(shift => (
                                    <React.Fragment key={shift.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`${new Date(shift.startTime).toLocaleDateString()} - ${new Date(shift.endTime).toLocaleDateString()}`}
                                                secondary={`Заработок: ${shift.earnings} ₽`}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Последние штрафы
                            </Typography>
                            <List>
                                {userPenalties.slice(-5).reverse().map(penalty => (
                                    <React.Fragment key={penalty.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`${new Date(penalty.date).toLocaleDateString()}`}
                                                secondary={`${penalty.amount} ₽ - ${penalty.reason}`}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
} 