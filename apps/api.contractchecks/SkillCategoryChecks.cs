using CareerPath.Api.Mappers;
using CareerPath.Api.Repositories.Skill;

public static class SkillCategoryChecks
{
    public static void Run()
    {
        var programmingId = Guid.NewGuid();
        var businessId = Guid.NewGuid();
        var candidateSkillId = Guid.NewGuid();
        var catalogSkillId = Guid.NewGuid();
        var data = new SkillMapData(
            [new SkillRepository.CategoryRow { Id = programmingId, Name = "Programlama Dilleri" },
             new SkillRepository.CategoryRow { Id = businessId, Name = "İşletme ve Strateji" }],
            [new SkillRepository.SkillRow { Id = catalogSkillId, CategoryId = programmingId, Name = "C#" }],
            [], [],
            [new SkillRepository.SelectedSkillRow { Id = candidateSkillId, CustomName = "C#", CategoryId = programmingId }],
            ["C#"]);

        var map = SkillMapper.BuildSkillMap(data);
        if (map.Skills.Count(skill => skill.Name == "C#") != 1 ||
            map.Skills.Single(skill => skill.Name == "C#").CategoryId != programmingId ||
            map.UnmatchedCvSkills.Count != 0)
        {
            throw new Exception("CV'den kaydedilen C# yanlış kategoriye yerleşti veya tekrarlandı.");
        }
    }
}
