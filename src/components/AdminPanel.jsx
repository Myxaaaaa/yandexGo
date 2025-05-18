import React, { useState } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tabs,
    Tab,
    Card,
    CardContent,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Avatar,
    Menu,
    MenuItem,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    Switch,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Person as PersonIcon,
    DirectionsBike as BikeIcon,
    LocalParking as ParkingIcon,
    AttachMoney as MoneyIcon,
    Warning as WarningIcon,
    Settings as SettingsIcon,
    PlayArrow as PlayArrowIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const AdminPanel = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useApp();
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPenaltyDialog, setShowPenaltyDialog] = useState(false);
    const [showScooterDialog, setShowScooterDialog] = useState(false);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [selectedParking, setSelectedParking] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [penaltyData, setPenaltyData] = useState({
        amount: '',
        reason: '',
    });
    const [scooterData, setScooterData] = useState({
        number: '',
        type: 'yandex',
    });
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        name: '',
        phone: '',
        email: '',
    });
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [showEditUserDialog, setShowEditUserDialog] = useState(false);
    const [showParkingSettingsDialog, setShowParkingSettingsDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        login: '',
        password: '',
        role: 'user',
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showReplacementDialog, setShowReplacementDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionDialog, setShowRejectionDialog] = useState(false);
    const [showAddParkingDialog, setShowAddParkingDialog] = useState(false);
    const [showEditParkingDialog, setShowEditParkingDialog] = useState(false);
    const [showAddScooterDialog, setShowAddScooterDialog] = useState(false);
    const [showReplacementRequestDialog, setShowReplacementRequestDialog] = useState(false);
    const [newParking, setNewParking] = useState({ name: '', yandexTarget: '', sunRentTarget: '' });
    const [scooterNumber, setScooterNumber] = useState('');
    const [scooterType, setScooterType] = useState('');
    const [replacementLocation, setReplacementLocation] = useState('');
    const [replacementImage, setReplacementImage] = useState(null);
    const [replacementUrgent, setReplacementUrgent] = useState(false);
    const [replacementNote, setReplacementNote] = useState('');
    const [selectedReplacementUser, setSelectedReplacementUser] = useState('');
    const [assignToAll, setAssignToAll] = useState(false);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingUser(null);
        setFormData({
            login: '',
            password: '',
            name: '',
            phone: '',
            email: '',
        });
    };

    const handleSubmit = () => {
        if (editingUser) {
            dispatch({
                type: 'UPDATE_USER',
                payload: {
                    ...editingUser,
                    ...formData,
                },
            });
        } else {
            dispatch({
                type: 'ADD_USER',
                payload: {
                    id: Date.now(),
                    ...formData,
                    role: 'user',
                    shifts: [],
                    penalties: [],
                },
            });
        }
        handleCloseDialog();
    };

    const handleDeleteUser = (userId) => {
        dispatch({ type: 'DELETE_USER', payload: userId });
        setShowSuccess(true);
        setSuccessMessage('Пользователь успешно удален');
    };

    const handleAddPenalty = (user) => {
        setEditingUser(user);
        setShowPenaltyDialog(true);
    };

    const handleSubmitPenalty = () => {
        if (!editingUser) return;

        const penalty = {
            id: Date.now(),
            userId: editingUser.id,
            amount: Number(penaltyData.amount),
            reason: penaltyData.reason,
            date: new Date(),
        };

        dispatch({ type: 'ADD_PENALTY', payload: penalty });
        setShowPenaltyDialog(false);
        setPenaltyData({ amount: '', reason: '' });
    };

    const handleAddScooter = () => {
        setShowScooterDialog(true);
    };

    const handleSubmitScooter = () => {
        const scooter = {
            id: Date.now(),
            number: scooterData.number,
            type: scooterData.type,
            status: 'available',
        };

        dispatch({ type: 'ADD_SCOOTER', payload: scooter });
        setShowScooterDialog(false);
        setScooterData({ number: '', type: 'yandex' });
    };

    const handleAddUser = () => {
        if (!newUser.name || !newUser.login || !newUser.password) {
            setShowSuccess(true);
            setSuccessMessage('Пожалуйста, заполните все поля');
            return;
        }

        const user = {
            id: Date.now(),
            ...newUser,
            shifts: [],
        };

        dispatch({ type: 'ADD_USER', payload: user });
        setShowAddUserDialog(false);
        setNewUser({
            name: '',
            login: '',
            password: '',
            role: 'user',
        });
        setShowSuccess(true);
        setSuccessMessage('Пользователь успешно добавлен');
    };

    const handleEditUser = () => {
        if (!selectedUser) return;

        dispatch({ type: 'UPDATE_USER', payload: selectedUser });
        setShowEditUserDialog(false);
        setShowSuccess(true);
        setSuccessMessage('Пользователь успешно обновлен');
    };

    const handleEditParking = (parking) => {
        setSelectedParking(parking);
        setShowParkingSettingsDialog(true);
    };

    const handleUpdateParking = () => {
        if (!selectedParking) return;

        dispatch({ type: 'UPDATE_PARKING', payload: selectedParking });
        setShowParkingSettingsDialog(false);
        setShowSuccess(true);
        setSuccessMessage('Настройки парковки обновлены');
    };

    const handleApproveReplacement = (request) => {
        // Обновляем количество самокатов на парковке
        const parking = state.parkings.find(p => p.id === request.parkingId);
        if (parking) {
            const updatedParking = {
                ...parking,
                yandexCount: request.scooterType === 'yandex' ? Math.max(0, parking.yandexCount - 1) : parking.yandexCount,
                sunRentCount: request.scooterType === 'sunrent' ? Math.max(0, parking.sunRentCount - 1) : parking.sunRentCount
            };
            dispatch({ type: 'UPDATE_PARKING', payload: updatedParking });
        }

        // Обновляем статус запроса
        const updatedRequest = {
            ...request,
            status: 'approved',
            adminName: state.currentUser.name,
            adminResponse: 'Запрос одобрен',
            respondedAt: new Date().toISOString(),
            userNotified: false
        };

        dispatch({ 
            type: 'UPDATE_REPLACEMENT_REQUEST', 
            payload: updatedRequest
        });

        setShowSuccess(true);
        setSuccessMessage('Запрос на замену самоката одобрен');
    };

    const handleRejectReplacement = () => {
        if (!selectedRequest || !rejectionReason) return;

        const updatedRequest = {
            ...selectedRequest,
            status: 'rejected',
            adminName: state.currentUser.name,
            adminResponse: rejectionReason,
            respondedAt: new Date().toISOString(),
            userNotified: false
        };

        dispatch({ 
            type: 'UPDATE_REPLACEMENT_REQUEST', 
            payload: updatedRequest
        });

        setShowRejectionDialog(false);
        setRejectionReason('');
        setShowSuccess(true);
        setSuccessMessage('Запрос на замену самоката отклонен');
    };

    const handleUpdateReplacementStatus = (requestId, newStatus) => {
        const request = state.replacementRequests.find(r => r.id === requestId);
        if (!request) return;

        const updatedRequest = {
            ...request,
            status: newStatus,
            updatedAt: new Date().toISOString()
        };

        dispatch({ 
            type: 'UPDATE_REPLACEMENT_REQUEST', 
            payload: updatedRequest
        });
    };

    const handleSubmitReplacementRequest = () => {
        if (!scooterNumber || !scooterType) return;

        const request = {
            id: Date.now(),
            scooterNumber,
            scooterType,
            location: replacementLocation,
            image: replacementImage,
            urgent: replacementUrgent,
            note: replacementNote,
            assignedTo: assignToAll ? 'all' : selectedReplacementUser,
            status: 'pending',
            createdAt: new Date().toISOString(),
            createdBy: state.currentUser.name,
            acceptedBy: null,
            acceptedAt: null,
            userNotified: false
        };

        // Добавляем запрос в глобальное состояние
        dispatch({ type: 'ADD_REPLACEMENT_REQUEST', payload: request });

        // Показываем уведомление об успешном создании
        setShowSuccess(true);
        setSuccessMessage('Запрос на замену успешно создан');

        // Закрываем диалог и сбрасываем поля
        setShowReplacementRequestDialog(false);
        setScooterNumber('');
        setScooterType('');
        setReplacementLocation('');
        setReplacementImage(null);
        setReplacementUrgent(false);
        setReplacementNote('');
        setSelectedReplacementUser('');
        setAssignToAll(false);
    };

    const filteredUsers = state.users.filter(user => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (user.name && user.name.toLowerCase().includes(searchLower)) ||
            (user.login && user.login.toLowerCase().includes(searchLower)) ||
            (user.phone && user.phone.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower))
        );
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab label="Пользователи" />
                            <Tab label="Ключевые парковки" />
                            <Tab label="Статистика" />
                            <Tab label="Замены" />
                        </Tabs>
                    </Paper>
                </Grid>

                {tabValue === 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <TextField
                                    placeholder="Поиск пользователей..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ width: 300 }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setShowAddUserDialog(true)}
                                >
                                    Добавить пользователя
                                </Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Имя</TableCell>
                                            <TableCell>Логин</TableCell>
                                            <TableCell>Телефон</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.login}</TableCell>
                                                <TableCell>{user.phone}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowEditUserDialog(true);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDeleteUser(user.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleAddPenalty(user)}>
                                                        <WarningIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                )}

                {tabValue === 1 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setShowAddParkingDialog(true)}
                                >
                                    Добавить парковку
                                </Button>
                            </Box>
                            <Grid container spacing={2}>
                                {state.parkings.map((parking) => (
                                    <Grid item xs={12} sm={6} md={4} key={parking.id}>
                                        <Card>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="h6">{parking.name}</Typography>
                                                    <IconButton onClick={() => handleEditParking(parking)}>
                                                        <SettingsIcon />
                                                    </IconButton>
                                                </Box>
                                                <Typography>
                                                    Yandex: {parking.yandexCount}/{parking.yandexTarget}
                                                </Typography>
                                                <Typography>
                                                    SunRent: {parking.sunRentCount}/{parking.sunRentTarget}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                {tabValue === 2 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Пользователи</Typography>
                                            <Typography>
                                                Всего: {state.users.length}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Смены</Typography>
                                            <Typography>
                                                Всего: {state.shifts.length}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Штрафы</Typography>
                                            <Typography>
                                                Всего: {state.penalties.length}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                {tabValue === 3 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Запросы на замену самокатов</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setShowReplacementRequestDialog(true)}
                                >
                                    Создать запрос на замену
                                </Button>
                            </Box>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Номер самоката</TableCell>
                                            <TableCell>Тип</TableCell>
                                            <TableCell>Местоположение</TableCell>
                                            <TableCell>Назначен</TableCell>
                                            <TableCell>Статус</TableCell>
                                            <TableCell>Срочно</TableCell>
                                            <TableCell>Создан</TableCell>
                                            <TableCell>Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {state.replacementRequests?.map((request) => (
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
                                                    {request.assignedTo === 'all' ? 'Все пользователи' : 
                                                     state.users.find(u => u.id === request.assignedTo)?.name || 'Не назначен'}
                                                    {request.acceptedBy && (
                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                            Принял: {state.users.find(u => u.id === request.acceptedBy)?.name}
                                                        </Typography>
                                                    )}
                                                </TableCell>
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
                                                        >
                                                            <PlayArrowIcon />
                                                        </IconButton>
                                                    )}
                                                    {request.status === 'in_progress' && (
                                                        <IconButton
                                                            onClick={() => handleUpdateReplacementStatus(request.id, 'picked_up')}
                                                        >
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    )}
                                                    {request.status === 'picked_up' && (
                                                        <IconButton
                                                            onClick={() => handleUpdateReplacementStatus(request.id, 'delivering')}
                                                        >
                                                            <BikeIcon />
                                                        </IconButton>
                                                    )}
                                                    {request.status === 'delivering' && (
                                                        <IconButton
                                                            onClick={() => handleUpdateReplacementStatus(request.id, 'completed')}
                                                        >
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Диалог добавления пользователя */}
            <Dialog open={showAddUserDialog} onClose={() => setShowAddUserDialog(false)}>
                <DialogTitle>Добавить пользователя</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Имя"
                        fullWidth
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Логин"
                        fullWidth
                        value={newUser.login}
                        onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Пароль"
                        type="password"
                        fullWidth
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Роль</InputLabel>
                        <Select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            label="Роль"
                        >
                            <MenuItem value="user">Пользователь</MenuItem>
                            <MenuItem value="admin">Администратор</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddUserDialog(false)}>Отмена</Button>
                    <Button onClick={handleAddUser} variant="contained">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог редактирования пользователя */}
            <Dialog open={showEditUserDialog} onClose={() => setShowEditUserDialog(false)}>
                <DialogTitle>Редактировать пользователя</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <>
                            <TextField
                                margin="dense"
                                label="Имя"
                                fullWidth
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Логин"
                                fullWidth
                                value={selectedUser.login}
                                onChange={(e) => setSelectedUser({ ...selectedUser, login: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Пароль"
                                type="password"
                                fullWidth
                                value={selectedUser.password}
                                onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Роль</InputLabel>
                                <Select
                                    value={selectedUser.role}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                    label="Роль"
                                >
                                    <MenuItem value="user">Пользователь</MenuItem>
                                    <MenuItem value="admin">Администратор</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEditUserDialog(false)}>Отмена</Button>
                    <Button onClick={handleEditUser} variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог настроек парковки */}
            <Dialog open={showParkingSettingsDialog} onClose={() => setShowParkingSettingsDialog(false)}>
                <DialogTitle>Настройки парковки</DialogTitle>
                <DialogContent>
                    {selectedParking && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                {selectedParking.name}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Текущее количество:
                                </Typography>
                                <TextField
                                    margin="dense"
                                    label="Yandex"
                                    type="number"
                                    fullWidth
                                    value={selectedParking.yandexCount}
                                    onChange={(e) => setSelectedParking({
                                        ...selectedParking,
                                        yandexCount: parseInt(e.target.value) || 0
                                    })}
                                />
                                <TextField
                                    margin="dense"
                                    label="SunRent"
                                    type="number"
                                    fullWidth
                                    value={selectedParking.sunRentCount}
                                    onChange={(e) => setSelectedParking({
                                        ...selectedParking,
                                        sunRentCount: parseInt(e.target.value) || 0
                                    })}
                                />
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Целевые показатели:
                                </Typography>
                                <TextField
                                    margin="dense"
                                    label="Цель Yandex"
                                    type="number"
                                    fullWidth
                                    value={selectedParking.yandexTarget}
                                    onChange={(e) => setSelectedParking({
                                        ...selectedParking,
                                        yandexTarget: parseInt(e.target.value) || 0
                                    })}
                                />
                                <TextField
                                    margin="dense"
                                    label="Цель SunRent"
                                    type="number"
                                    fullWidth
                                    value={selectedParking.sunRentTarget}
                                    onChange={(e) => setSelectedParking({
                                        ...selectedParking,
                                        sunRentTarget: parseInt(e.target.value) || 0
                                    })}
                                />
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowParkingSettingsDialog(false)}>Отмена</Button>
                    <Button onClick={handleUpdateParking} variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог отклонения запроса */}
            <Dialog open={showRejectionDialog} onClose={() => setShowRejectionDialog(false)}>
                <DialogTitle>Отклонить запрос на замену</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Запрос от: {selectedRequest?.userName}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Парковка: {selectedRequest?.parkingName}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Номер самоката: {selectedRequest?.scooterNumber}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Причина замены: {selectedRequest?.reason}
                    </Typography>
                    <TextField
                        margin="dense"
                        label="Причина отказа"
                        fullWidth
                        multiline
                        rows={3}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Укажите причину отказа..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowRejectionDialog(false)}>Отмена</Button>
                    <Button 
                        onClick={handleRejectReplacement} 
                        variant="contained" 
                        color="error"
                        disabled={!rejectionReason}
                    >
                        Отклонить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог создания запроса на замену */}
            <Dialog open={showReplacementRequestDialog} onClose={() => setShowReplacementRequestDialog(false)}>
                <DialogTitle>Создать запрос на замену самоката</DialogTitle>
                <DialogContent>
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
                        label="Местоположение"
                        fullWidth
                        value={replacementLocation}
                        onChange={(e) => setReplacementLocation(e.target.value)}
                        placeholder="Укажите местоположение самоката"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={assignToAll}
                                onChange={(e) => setAssignToAll(e.target.checked)}
                            />
                        }
                        label="Назначить всем пользователям"
                    />
                    {!assignToAll && (
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Назначить пользователю</InputLabel>
                            <Select
                                value={selectedReplacementUser}
                                onChange={(e) => setSelectedReplacementUser(e.target.value)}
                                label="Назначить пользователю"
                            >
                                {state.users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={replacementUrgent}
                                onChange={(e) => setReplacementUrgent(e.target.checked)}
                            />
                        }
                        label="Срочно"
                    />
                    <TextField
                        margin="dense"
                        label="Примечание"
                        fullWidth
                        multiline
                        rows={3}
                        value={replacementNote}
                        onChange={(e) => setReplacementNote(e.target.value)}
                        placeholder="Дополнительная информация..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowReplacementRequestDialog(false)}>Отмена</Button>
                    <Button
                        onClick={handleSubmitReplacementRequest}
                        variant="contained"
                        disabled={!scooterNumber || !scooterType || (!assignToAll && !selectedReplacementUser)}
                    >
                        Создать запрос
                    </Button>
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

export default AdminPanel; 