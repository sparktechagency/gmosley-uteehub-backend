import Team from './team.model';
import { ITeam } from './team.interface';

class TeamService {
  async createTeam(teamData: ITeam) {
    const team = new Team(teamData);
    return await team.save();
  }

  async getTeams(): Promise<ITeam[]> {
    return await Team.find();
  }

  async getTeamById(id: string) {
    return await Team.findById(id);
  }

  async updateTeam(id: string, teamData: ITeam) {
    return await Team.findByIdAndUpdate(id, teamData, { new: true });
  }

  async deleteTeam(id: string) {
    return await Team.deleteOne({ _id: id });
  }
}

export default new TeamService();
