import { Request, Response } from 'express';
import teamServices from './team.services';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';
import asyncHandler from '../../../shared/asyncHandler';

class TeamController {
  createTeam = asyncHandler(async (req: Request, res: Response) => {
    const teamData = req.body;
    const files = req.files;

    if (files && files.image) {
      const imagePath = await fileUploader(files as FileArray, `${teamData.name}-image`, 'image');
      teamData.image = imagePath as string;
    }

    const newTeam = await teamServices.createTeam(teamData);

    if (!newTeam) {
      throw new CustomError.BadRequestError('Failed to create team!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      status: 'success',
      message: 'Team created successfully',
      data: newTeam,
    });
  });

  getTeams = asyncHandler(async (req: Request, res: Response) => {
    const teams = await teamServices.getTeams();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Teams retrieved successfully',
      data: teams,
    });
  });

  getTeamById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const team = await teamServices.getTeamById(id);

    if (!team) {
      throw new CustomError.NotFoundError('Team not found!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Team retrieved successfully',
      data: team,
    });
  });

  updateTeam = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const teamData = req.body;
    const files = req.files;

    if (files && files.image) {
      const imagePath = await fileUploader(files as FileArray, `${teamData.name}-image`, 'image');
      teamData.image = imagePath as string;
    }

    const updatedTeam = await teamServices.updateTeam(id, teamData);

    if (!updatedTeam?.isModified) {
      throw new CustomError.BadRequestError('Failed to update team!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Team updated successfully',
    });
  });

  deleteTeam = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedTeam = await teamServices.deleteTeam(id);

    if (!deletedTeam?.deletedCount) {
      throw new CustomError.BadRequestError('Failed to delete team!');
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Team deleted successfully',
    });
  });
}

export default new TeamController();
