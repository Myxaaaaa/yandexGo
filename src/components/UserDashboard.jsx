import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
    Alert,
    Snackbar,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Tabs,
    Tab,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Chip,
} from '@mui/material';
import {
    PlayArrow as StartIcon,
    Stop as StopIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Visibility as ViewIcon,
    DirectionsBike as DirectionsBikeIcon,
} from '@mui/icons-material';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useApp();
    const [showScooterDialog, setShowScooterDialog] = useState(false);
    const [showRemoveScooterDialog, setShowRemoveScooterDialog] = useState(false);
    const [showShiftDetailsDialog, setShowShiftDetailsDialog] = useState(false);
    const [selectedParking, setSelectedParking] = useState(null);
    const [selectedShift, setSelectedShift] = useState(null);
    const [scooterType, setScooterType] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [scooterNumber, setScooterNumber] = useState('');
    const [replacementReason, setReplacementReason] = useState('');
    const [showAdminResponse, setShowAdminResponse] = useState(false);
    const [adminResponse, setAdminResponse] = useState(null);
    const [selectedParkingForRemoval, setSelectedParkingForRemoval] = useState(null);
    const [scooterQuantity, setScooterQuantity] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const SPEED_MULTIPLIER = 1;

    const currentUser = state.users.find(u => u.id === state.currentUser?.id);
    const activeShift = currentUser?.shifts.find(s => !s.endTime);

    useEffect(() => {
        let interval;
        if (activeShift) {
            const startTime = new Date(activeShift.startTime).getTime();
            const updateElapsedTime = () => {
                const now = new Date().getTime();
                const elapsed = Math.floor((now - startTime) / 1000) * SPEED_MULTIPLIER;
                setElapsedTime(elapsed);
            };
            
            updateElapsedTime();
            interval = setInterval(updateElapsedTime, 1000);
        }
        return () => clearInterval(interval);
    }, [activeShift]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartShift = () => {
        if (!currentUser) {
            console.error('No current user found');
            return;
        }

        // Создаем новую смену с нулевыми счетчиками для пользователя
        const shift = {
            id: Date.now(),
            userId: currentUser.id,
            startTime: new Date().toISOString(),
            hourlyRate: 100,
            endTime: null,
            earnings: 0,
            parkings: state.parkings.map(p => ({
                id: p.id,
                name: p.name,
                yandexCount: 0, // Начинаем с нуля
                sunRentCount: 0, // Начинаем с нуля
                yandexTarget: p.yandexTarget,
                sunRentTarget: p.sunRentTarget,
                userAddedYandex: 0, // Счетчик добавленных пользователем Yandex
                userAddedSunRent: 0 // Счетчик добавленных пользователем SunRent
            })),
        };

        dispatch({ type: 'ADD_SHIFT', payload: shift });
        setElapsedTime(0);
    };

    const handleEndShift = () => {
        if (!activeShift || !currentUser) return;

        // Считаем только самокаты, добавленные пользователем
        const totalScooters = activeShift.parkings.reduce((sum, p) => 
            sum + p.userAddedYandex + p.userAddedSunRent, 0
        );
        let finalRate = 100;

        if (totalScooters >= 100) {
            finalRate = 150;
        } else if (totalScooters >= 60) {
            finalRate = 120;
        }

        const startTime = new Date(activeShift.startTime).getTime();
        const endTime = new Date().getTime();
        const totalSeconds = ((endTime - startTime) / 1000) * SPEED_MULTIPLIER;
        const totalMinutes = totalSeconds / 60;
        
        const hours = totalMinutes / 60;
        const earnings = Math.round(hours * finalRate * 100) / 100;

        // Формируем отчет по парковкам с учетом только добавленных пользователем самокатов
        const parkingReport = activeShift.parkings
            .filter(p => p.userAddedYandex > 0 || p.userAddedSunRent > 0)
            .map(p => `${p.name}: Yandex - ${p.userAddedYandex}, SunRent - ${p.userAddedSunRent}`)
            .join('\n');

        dispatch({
            type: 'UPDATE_SHIFT',
            payload: {
                ...activeShift,
                endTime: new Date().toISOString(),
                earnings,
                finalRate,
                totalScooters,
                duration: totalMinutes,
            },
        });

        const hoursWorked = Math.floor(totalMinutes / 60);
        const minutesWorked = Math.floor(totalMinutes % 60);
        const timeMessage = hoursWorked > 0 
            ? `${hoursWorked} ч. ${minutesWorked} мин.`
            : `${minutesWorked} мин.`;

        setShowSuccess(true);
        setSuccessMessage(
            `Смена завершена!\n` +
            `Время работы: ${timeMessage}\n` +
            `Заработок: ${earnings} сом (${totalScooters} самокатов, ${finalRate} сом/час)\n\n` +
            `Отчет по парковкам:\n${parkingReport}`
        );
    };

    const handleViewShiftDetails = (shift) => {
        setSelectedShift(shift);
        setShowShiftDetailsDialog(true);
    };

    const handleAddScooter = (parking) => {
        setSelectedParking(parking);
        setShowScooterDialog(true);
    };

    const handleRemoveScooter = (parking) => {
        setSelectedParkingForRemoval(parking);
        setShowRemoveScooterDialog(true);
    };

    const handleSubmitScooter = () => {
        if (!selectedParking || !activeShift || !scooterQuantity || !scooterType) return;

        const quantity = parseInt(scooterQuantity);
        if (isNaN(quantity) || quantity < 1) {
            setShowSuccess(true);
            setSuccessMessage('Пожалуйста, введите корректное количество');
            return;
        }

        // Обновляем парковку в глобальном состоянии
        const updatedParking = {
            ...selectedParking,
            yandexCount: scooterType === 'yandex' ? selectedParking.yandexCount + quantity : selectedParking.yandexCount,
            sunRentCount: scooterType === 'sunRent' ? selectedParking.sunRentCount + quantity : selectedParking.sunRentCount,
        };
        dispatch({ type: 'UPDATE_PARKING', payload: updatedParking });

        // Обновляем счетчики в активной смене пользователя
        const updatedShift = {
            ...activeShift,
            parkings: activeShift.parkings.map(p => {
                if (p.id === selectedParking.id) {
                    return {
                        ...p,
                        yandexCount: scooterType === 'yandex' ? p.yandexCount + quantity : p.yandexCount,
                        sunRentCount: scooterType === 'sunRent' ? p.sunRentCount + quantity : p.sunRentCount,
                        userAddedYandex: scooterType === 'yandex' ? p.userAddedYandex + quantity : p.userAddedYandex,
                        userAddedSunRent: scooterType === 'sunRent' ? p.userAddedSunRent + quantity : p.userAddedSunRent
                    };
                }
                return p;
            })
        };
        dispatch({ type: 'UPDATE_SHIFT', payload: updatedShift });

        // Проверяем достижение целей
        const yandexComplete = updatedShift.parkings.find(p => p.id === selectedParking.id)?.yandexCount >= selectedParking.yandexTarget;
        const sunRentComplete = updatedShift.parkings.find(p => p.id === selectedParking.id)?.sunRentCount >= selectedParking.sunRentTarget;

        if (yandexComplete && sunRentComplete) {
            setShowSuccess(true);
            setSuccessMessage(`Молодец! Парковка "${selectedParking.name}" полностью заполнена! Идите к следующей.`);
        } else if (scooterType === 'yandex' && yandexComplete) {
            setShowSuccess(true);
            setSuccessMessage(`Поздравляем! Вы достигли цели по Yandex на ${selectedParking.name}. Заполняйте SunRent!`);
        } else if (scooterType === 'sunRent' && sunRentComplete) {
            setShowSuccess(true);
            setSuccessMessage(`Поздравляем! Вы достигли цели по SunRent на ${selectedParking.name}. Заполняйте Yandex!`);
        }

        setShowScooterDialog(false);
        setScooterType('');
        setScooterQuantity('');
    };

    // Добавляем функцию для проверки ответов администратора
    const checkAdminResponses = () => {
        if (currentUser) {
            const pendingRequests = state.replacementRequests?.filter(
                request => request.userId === currentUser.id && 
                          request.status !== 'pending' &&
                          !request.userNotified
            );

            if (pendingRequests?.length > 0) {
                const latestRequest = pendingRequests[pendingRequests.length - 1];
                setAdminResponse(latestRequest);
                setShowAdminResponse(true);

                // Отмечаем запрос как уведомленный
                dispatch({
                    type: 'UPDATE_REPLACEMENT_REQUEST',
                    payload: { ...latestRequest, userNotified: true }
                });
            }
        }
    };

    // Проверяем ответы администратора при каждом изменении запросов
    useEffect(() => {
        checkAdminResponses();
    }, [state.replacementRequests, currentUser]);

    const handleSubmitRemoveScooter = () => {
        if (!selectedParkingForRemoval || !scooterNumber || !replacementReason) return;

        const request = {
            id: Date.now(),
            userId: state.currentUser.id,
            userName: state.currentUser.name,
            parkingId: selectedParkingForRemoval.id,
            parkingName: selectedParkingForRemoval.name,
            scooterNumber,
            scooterType,
            reason: replacementReason,
            status: 'pending',
            createdAt: new Date().toISOString(),
            userNotified: false
        };

        dispatch({ type: 'ADD_REPLACEMENT_REQUEST', payload: request });
        setShowRemoveScooterDialog(false);
        setScooterNumber('');
        setReplacementReason('');
        setScooterType('yandex');
        setShowSuccess(true);
        setSuccessMessage('Запрос на замену самоката отправлен');
    };

    const handleResetShifts = () => {
        if (!currentUser) return;
        
        // Обновляем пользователя, удаляя все завершенные смены
        const updatedUser = {
            ...currentUser,
            shifts: currentUser.shifts.filter(s => !s.endTime) // Оставляем только активную смену, если она есть
        };
        
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        setShowSuccess(true);
        setSuccessMessage('История смен очищена');
    };

    const handleDeleteShift = (shiftId) => {
        if (!currentUser) return;
        
        // Удаляем конкретную смену
        const updatedUser = {
            ...currentUser,
            shifts: currentUser.shifts.filter(s => s.id !== shiftId)
        };
        
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        setShowSuccess(true);
        setSuccessMessage('Смена удалена');
    };

    const handleUpdateReplacementStatus = (requestId, newStatus) => {
        const request = state.replacementRequests.find(r => r.id === requestId);
        if (!request) return;

        // Если запрос еще не принят никем и пользователь начинает работу
        if (newStatus === 'in_progress' && !request.acceptedBy) {
            const updatedRequest = {
                ...request,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                acceptedBy: state.currentUser.id,
                acceptedAt: new Date().toISOString()
            };
            dispatch({ 
                type: 'UPDATE_REPLACEMENT_REQUEST', 
                payload: updatedRequest
            });
            return;
        }

        // Если запрос уже принят этим пользователем
        if (request.acceptedBy === state.currentUser.id) {
            const updatedRequest = {
                ...request,
                status: newStatus,
                updatedAt: new Date().toISOString()
            };
            dispatch({ 
                type: 'UPDATE_REPLACEMENT_REQUEST', 
                payload: updatedRequest
            });
        }
    };

    // Добавляем useEffect для отладки
    useEffect(() => {
        console.log('Current user:', state.currentUser);
        console.log('All replacement requests:', state.replacementRequests);
        console.log('Filtered requests:', state.replacementRequests?.filter(request => 
            (request.assignedTo === 'all' || request.assignedTo === state.currentUser?.id) &&
            request.status !== 'completed'
        ));
    }, [state.replacementRequests, state.currentUser]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Парковки" />
                <Tab label="Замены" />
            </Tabs>

            {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    {activeShift ? `Смена активна: ${formatTime(elapsedTime)}` : 'Смена не начата'}
                                </Typography>
                                {!activeShift ? (
                                    <Button
                                        variant="contained"
                                        startIcon={<StartIcon />}
                                        onClick={handleStartShift}
                                    >
                                        Начать смену
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<StopIcon />}
                                        onClick={handleEndShift}
                                    >
                                        Завершить смену
                                    </Button>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Парковки
                            </Typography>
                            <Grid container spacing={2}>
                                {state.parkings.map((parking) => (
                                    <Grid item xs={12} sm={6} md={4} key={parking.id}>
                                        <Card
                                            sx={{
                                                bgcolor: parking.yandexCount >= parking.yandexTarget && 
                                                        parking.sunRentCount >= parking.sunRentTarget 
                                                    ? '#e8f5e9' 
                                                    : 'white',
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6">{parking.name}</Typography>
                                                <Typography>
                                                    Yandex: {parking.yandexCount}/{parking.yandexTarget}
                                                </Typography>
                                                <Typography>
                                                    SunRent: {parking.sunRentCount}/{parking.sunRentTarget}
                                                </Typography>
                                                {activeShift && (
                                                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<AddIcon />}
                                                            onClick={() => handleAddScooter(parking)}
                                                        >
                                                            Добавить
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            startIcon={<DeleteIcon />}
                                                            onClick={() => handleRemoveScooter(parking)}
                                                        >
                                                            Забрать
                                                        </Button>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                История смен
                            </Typography>
                            <List>
                                {currentUser?.shifts
                                    .filter(s => s.endTime)
                                    .map((shift) => (
                                        <ListItem
                                            key={shift.id}
                                            secondaryAction={
                                                <Box>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleViewShiftDetails(shift)}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleDeleteShift(shift.id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <ListItemText
                                                primary={`Смена ${new Date(shift.startTime).toLocaleDateString()}`}
                                                secondary={`Заработок: ${shift.earnings} сом (${shift.totalScooters} самокатов)`}
                                            />
                                        </ListItem>
                                    ))}
                            </List>
                            {currentUser?.shifts.filter(s => s.endTime).length > 0 && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleResetShifts}
                                    sx={{ mt: 2 }}
                                >
                                    Очистить историю
                                </Button>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Назначенные замены
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Номер самоката</TableCell>
                                    <TableCell>Тип</TableCell>
                                    <TableCell>Местоположение</TableCell>
                                    <TableCell>Статус</TableCell>
                                    <TableCell>Срочно</TableCell>
                                    <TableCell>Создан</TableCell>
                                    <TableCell>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.replacementRequests && state.replacementRequests.length > 0 ? (
                                    state.replacementRequests
                                        .filter(request => 
                                            (request.assignedTo === 'all' || request.assignedTo === state.currentUser?.id) &&
                                            request.status !== 'completed'
                                        )
                                        .map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>{request.scooterNumber}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={request.scooterType === 'yandex' ? 'Yandex' : 'SunRent'}
                                                        color={request.scooterType === 'yandex' ? 'primary' : 'secondary'}
                                                    />
                                                </TableCell>
                                                <TableCell>{request.location || 'Не указано'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={
                                                            request.status === 'pending' ? 'Ожидает' : 
                                                            request.status === 'in_progress' ? 'В пути' :
                                                            request.status === 'picked_up' ? 'Забран' :
                                                            request.status === 'delivering' ? 'Везет на склад' :
                                                            'Завершен'
                                                        }
                                                        color={
                                                            request.status === 'pending' ? 'warning' : 
                                                            request.status === 'in_progress' ? 'info' :
                                                            request.status === 'picked_up' ? 'success' :
                                                            request.status === 'delivering' ? 'primary' :
                                                            'success'
                                                        }
                                                    />
                                                    {request.acceptedBy && (
                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                            Выполняет: {state.users.find(u => u.id === request.acceptedBy)?.name}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {request.urgent && (
                                                        <Chip label="Срочно" color="error" />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(request.createdAt).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {request.status === 'pending' && (
                                                        <IconButton
                                                            onClick={() => handleUpdateReplacementStatus(request.id, 'in_progress')}
                                                            title="Начать выполнение"
                                                        >
                                                            <StartIcon />
                                                        </IconButton>
                                                    )}
                                                    {request.status === 'in_progress' && request.acceptedBy === state.currentUser?.id && (
                                                        <IconButton
                                                            onClick={() => handleUpdateReplacementStatus(request.id, 'picked_up')}
                                                            title="Отметить как забранный"
                                                        >
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    )}
                                                    {request.status === 'picked_up' && request.acceptedBy === state.currentUser?.id && (
                                                        <IconButton
                                                            onClick={() => handleUpdateReplacementStatus(request.id, 'delivering')}
                                                            title="Отметить как везущий на склад"
                                                        >
                                                            <DirectionsBikeIcon />
                                                        </IconButton>
                                                    )}
                                                    {request.status === 'delivering' && request.acceptedBy === state.currentUser?.id && (
                                                        <IconButton
                                                            onClick={() => handleUpdateReplacementStatus(request.id, 'completed')}
                                                            title="Отметить как доставленный"
                                                        >
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            Нет доступных запросов на замену
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Диалог добавления самоката */}
            <Dialog open={showScooterDialog} onClose={() => setShowScooterDialog(false)}>
                <DialogTitle>Добавить самокаты</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Тип самоката</InputLabel>
                        <Select
                            value={scooterType}
                            onChange={(e) => setScooterType(e.target.value)}
                            label="Тип самоката"
                        >
                            <MenuItem value="yandex">Yandex</MenuItem>
                            <MenuItem value="sunRent">SunRent</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Количество"
                        type="number"
                        fullWidth
                        value={scooterQuantity}
                        onChange={(e) => setScooterQuantity(e.target.value)}
                        inputProps={{ min: 1 }}
                        placeholder="Введите количество"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowScooterDialog(false)}>Отмена</Button>
                    <Button 
                        onClick={handleSubmitScooter} 
                        variant="contained"
                        disabled={!scooterType || !scooterQuantity}
                    >
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог просмотра деталей смены */}
            <Dialog
                open={showShiftDetailsDialog}
                onClose={() => setShowShiftDetailsDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Детали смены {selectedShift && new Date(selectedShift.startTime).toLocaleDateString()}
                </DialogTitle>
                <DialogContent>
                    {selectedShift && (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                Время работы: {
                                    selectedShift.duration 
                                        ? `${Math.floor(selectedShift.duration / 60)} ч. ${Math.floor(selectedShift.duration % 60)} мин.`
                                        : 'Не указано'
                                }
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Заработок: {selectedShift.earnings} сом
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Всего самокатов: {selectedShift.totalScooters}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Ставка: {selectedShift.finalRate} сом/час
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                Парковки:
                            </Typography>
                            <Grid container spacing={2}>
                                {selectedShift.parkings.map((parking) => (
                                    <Grid item xs={12} sm={6} key={parking.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">{parking.name}</Typography>
                                                <Typography>
                                                    Yandex: {parking.yandexCount}
                                                </Typography>
                                                <Typography>
                                                    SunRent: {parking.sunRentCount}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowShiftDetailsDialog(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>

            {/* Диалог запроса на замену самоката */}
            <Dialog open={showRemoveScooterDialog} onClose={() => setShowRemoveScooterDialog(false)}>
                <DialogTitle>Запрос на замену самоката</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Парковка: {selectedParkingForRemoval?.name}
                    </Typography>
                    <TextField
                        margin="dense"
                        label="Номер самоката"
                        fullWidth
                        value={scooterNumber}
                        onChange={(e) => setScooterNumber(e.target.value)}
                        placeholder="Введите номер самоката"
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Тип самоката</InputLabel>
                        <Select
                            value={scooterType}
                            onChange={(e) => setScooterType(e.target.value)}
                            label="Тип самоката"
                        >
                            <MenuItem value="yandex">Yandex</MenuItem>
                            <MenuItem value="sunrent">SunRent</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Причина замены"
                        fullWidth
                        multiline
                        rows={3}
                        value={replacementReason}
                        onChange={(e) => setReplacementReason(e.target.value)}
                        placeholder="Укажите причину замены самоката..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowRemoveScooterDialog(false)}>Отмена</Button>
                    <Button 
                        onClick={handleSubmitRemoveScooter} 
                        variant="contained" 
                        disabled={!scooterNumber || !replacementReason || !scooterType}
                    >
                        Отправить запрос
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог ответа администратора */}
            <Dialog open={showAdminResponse} onClose={() => setShowAdminResponse(false)}>
                <DialogTitle>
                    {adminResponse?.status === 'approved' ? 'Запрос одобрен' : 'Запрос отклонен'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        {adminResponse?.status === 'approved' 
                            ? 'Ваш запрос на замену самоката был одобрен.'
                            : 'Ваш запрос на замену самоката был отклонен.'}
                    </Typography>
                    {adminResponse?.status === 'rejected' && (
                        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                            Причина отказа: {adminResponse?.adminResponse}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAdminResponse(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={() => setShowSuccess(false)}
            >
                <Alert onClose={() => setShowSuccess(false)} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UserDashboard; 