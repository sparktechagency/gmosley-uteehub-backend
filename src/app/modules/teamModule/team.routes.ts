import { Router } from 'express';
import TeamController from './team.controllers';

const teamRouter = Router();

teamRouter.post('/create', TeamController.createTeam);
teamRouter.get('/retrieve/all', TeamController.getTeams);
teamRouter.get('/retrieve/:id', TeamController.getTeamById);
teamRouter.patch('/update/:id', TeamController.updateTeam);
teamRouter.delete('/delete/:id', TeamController.deleteTeam);

export default teamRouter;
