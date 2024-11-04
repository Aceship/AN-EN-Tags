





local TestStubHotfixer = Class("TestStubHotfixer", HotfixBase)

function TestStubHotfixer:OnInit()
  if TEST then
    self:Fix_ex(CS.Torappu.HotfixTestStub, "GenerateDevInfo", function(devVersion, dataVer)
      local info = CS.Torappu.HotfixTestStub.GenerateDevInfo(devVersion, dataVer)
      info = "HOTFIX_ENABLE\n" .. info
      return info
    end)
  end
end

return TestStubHotfixer