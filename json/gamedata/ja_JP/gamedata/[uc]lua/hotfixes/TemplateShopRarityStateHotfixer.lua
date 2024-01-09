




local TemplateShopRarityStateHotfixer = Class("TemplateShopRarityStateHotfixer", HotfixBase)

local function _FixOnEnter(self)
  self:OnEnter()
  self._shopIcon.gameObject:GetComponent("RectTransform").anchoredPosition = CS.UnityEngine.Vector2(100, -26)
  self._shopName.gameObject:GetComponent("RectTransform").anchoredPosition = CS.UnityEngine.Vector2(210, -26)
  self._shopName.gameObject:GetComponent("RectTransform").sizeDelta = CS.UnityEngine.Vector2(170, 48)
end

function TemplateShopRarityStateHotfixer:OnInit()
  xlua.private_accessible(CS.Torappu.UI.TemplateShop.TemplateShopRarityState)

  self:Fix_ex(CS.Torappu.UI.TemplateShop.TemplateShopRarityState, "OnEnter", function(self)
    local ok, errorInfo = xpcall(_FixOnEnter, debug.traceback, self)
    if not ok then
        LogError("[TemplateShopRarityStateHotfixer] fix" .. errorInfo)
    end
end)
end

function TemplateShopRarityStateHotfixer:OnDispose()
end

return TemplateShopRarityStateHotfixer