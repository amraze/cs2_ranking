using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Domain.Factories
{
    public class MatchFactory
    {

        public static Match CreateFromSheets(List<string> row, Dictionary<string, int> maps)
        {
            return new Match(
                int.Parse(row[1]),
                DateTime.Parse(row[2]),
                maps[row[3]],
                row[4].ToUpper() switch { 
                    "LOSS" => 0, 
                    "DRAW" => 1, 
                    "WIN" => 2, 
                    _ => -1 
                }
            );
        }
    }
}
