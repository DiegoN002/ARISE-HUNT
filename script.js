-- Servicios
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local UserInputService = game:GetService("UserInputService")
local TweenService = game:GetService("TweenService")
local CoreGui = game:GetService("CoreGui")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

-- Crear ScreenGui
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = LocalPlayer:WaitForChild("PlayerGui")
ScreenGui.ResetOnSpawn = false

-- Variables para control de arrastre
local dragging
local dragInput
local dragStart
local startPos

-- Ventana principal
local Frame = Instance.new("Frame")
Frame.Size = UDim2.new(0, 280, 0, 350)
Frame.Position = UDim2.new(0.35, 0, 0.3, 0)
Frame.BackgroundColor3 = Color3.fromRGB(20, 20, 20)
Frame.BorderSizePixel = 0
Frame.Parent = ScreenGui
Instance.new("UICorner", Frame).CornerRadius = UDim.new(0, 8)

-- Barra de título (para arrastrar)
local TitleBar = Instance.new("Frame")
TitleBar.Size = UDim2.new(1, 0, 0, 30)
TitleBar.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
TitleBar.BorderSizePixel = 0
TitleBar.Parent = Frame
Instance.new("UICorner", TitleBar).CornerRadius = UDim.new(0, 8)

-- Título centrado
local Titulo = Instance.new("TextLabel")
Titulo.Size = UDim2.new(0.8, 0, 1, 0)
Titulo.Position = UDim2.new(0.1, 0, 0, 0)
Titulo.BackgroundTransparency = 1
Titulo.Text = "RN TEAM"
Titulo.TextColor3 = Color3.fromRGB(255, 255, 255)
Titulo.Font = Enum.Font.SourceSansBold
Titulo.TextSize = 16
Titulo.TextXAlignment = Enum.TextXAlignment.Center
Titulo.Parent = TitleBar

-- Botón de minimizar
local MinimizeButton = Instance.new("TextButton")
MinimizeButton.Size = UDim2.new(0, 30, 0, 30)
MinimizeButton.Position = UDim2.new(1, -30, 0, 0)
MinimizeButton.BackgroundTransparency = 1
MinimizeButton.Text = "-"
MinimizeButton.TextColor3 = Color3.fromRGB(255, 255, 255)
MinimizeButton.Font = Enum.Font.SourceSansBold
MinimizeButton.TextSize = 20
MinimizeButton.Parent = TitleBar

-- Contenedor para las pestañas
local TabContainer = Instance.new("Frame")
TabContainer.Size = UDim2.new(1, -10, 0, 35)
TabContainer.Position = UDim2.new(0, 5, 0, 35)
TabContainer.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
TabContainer.BorderSizePixel = 0
TabContainer.Parent = Frame
Instance.new("UICorner", TabContainer).CornerRadius = UDim.new(0, 6)

-- Layout horizontal para las pestañas
local TabLayout = Instance.new("UIListLayout")
TabLayout.FillDirection = Enum.FillDirection.Horizontal
TabLayout.Padding = UDim.new(0, 2)
TabLayout.Parent = TabContainer

-- Contenedor principal para el contenido CON DESPLAZAMIENTO SUAVE
local MainContentContainer = Instance.new("ScrollingFrame")
MainContentContainer.Size = UDim2.new(1, -10, 1, -110)
MainContentContainer.Position = UDim2.new(0, 5, 0, 75)
MainContentContainer.BackgroundTransparency = 1
MainContentContainer.BorderSizePixel = 0
MainContentContainer.ScrollBarThickness = 0
MainContentContainer.ScrollBarImageTransparency = 1
MainContentContainer.ClipsDescendants = true
MainContentContainer.Parent = Frame

-- Texto fijo abajo (créditos)
local Creditos = Instance.new("TextLabel")
Creditos.Size = UDim2.new(1, 0, 0, 25)
Creditos.Position = UDim2.new(0, 0, 1, -25)
Creditos.BackgroundTransparency = 1
Creditos.Text = "YouTube: RN_TEAM"
Creditos.TextColor3 = Color3.fromRGB(200, 200, 200)
Creditos.Font = Enum.Font.SourceSansBold
Creditos.TextSize = 14
Creditos.Parent = Frame

-- Frame de fondo para permitir arrastrar por toda la interfaz
local BackgroundDrag = Instance.new("Frame")
BackgroundDrag.Size = UDim2.new(1, 0, 1, 0)
BackgroundDrag.BackgroundTransparency = 1
BackgroundDrag.BorderSizePixel = 0
BackgroundDrag.ZIndex = 0
BackgroundDrag.Parent = Frame

-- Sistema de pestañas
local tabs = {}
local currentTab = nil

local function createTab(tabName)
    local tabButton = Instance.new("TextButton")
    tabButton.Size = UDim2.new(0.24, 0, 0.8, 0)
    tabButton.Position = UDim2.new(0, 0, 0.1, 0)
    tabButton.BackgroundColor3 = Color3.fromRGB(35, 35, 35)
    tabButton.BorderSizePixel = 0
    tabButton.Text = tabName
    tabButton.TextColor3 = Color3.fromRGB(200, 200, 200)
    tabButton.Font = Enum.Font.SourceSansBold
    tabButton.TextSize = 12
    tabButton.Parent = TabContainer
    Instance.new("UICorner", tabButton).CornerRadius = UDim.new(0, 4)
    
    local tabContent = Instance.new("Frame")
    tabContent.Size = UDim2.new(1, 0, 1, 0)
    tabContent.BackgroundTransparency = 1
    tabContent.Visible = false
    tabContent.Parent = MainContentContainer
    
    local tabListLayout = Instance.new("UIListLayout")
    tabListLayout.Padding = UDim.new(0, 8)
    tabListLayout.Parent = tabContent
    
    local tab = {
        button = tabButton,
        content = tabContent,
        layout = tabListLayout
    }
    
    tabs[tabName] = tab
    
    tabButton.MouseButton1Click:Connect(function()
        -- Ocultar todas las pestañas
        for name, tabData in pairs(tabs) do
            tabData.content.Visible = false
            tabData.button.BackgroundColor3 = Color3.fromRGB(35, 35, 35)
            tabData.button.TextColor3 = Color3.fromRGB(200, 200, 200)
        end
        
        -- Mostrar pestaña clicada
        tab.content.Visible = true
        tab.button.BackgroundColor3 = Color3.fromRGB(60, 60, 60)
        tab.button.TextColor3 = Color3.fromRGB(255, 255, 255)
        
        currentTab = tabName
        ajustarAlturaJanela()
    end)
    
    return tab
end

-- Función para ajustar automáticamente la altura de la ventana
local function ajustarAlturaJanela()
    local alturaMinima = 350
    local alturaMaxima = 450
    
    if currentTab and tabs[currentTab] then
        local tabContent = tabs[currentTab].content
        local alturaConteudo = tabs[currentTab].layout.AbsoluteContentSize.Y + 100
        
        local nuevaAltura = math.clamp(alturaConteudo, alturaMinima, alturaMaxima)
        
        local tween = TweenService:Create(
            Frame,
            TweenInfo.new(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            {Size = UDim2.new(0, 280, 0, nuevaAltura)}
        )
        tween:Play()
        
        MainContentContainer.CanvasSize = UDim2.new(0, 0, 0, tabs[currentTab].layout.AbsoluteContentSize.Y)
    end
end

-- Función para arrastrar la ventana
local function update(input)
    local delta = input.Position - dragStart
    Frame.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
end

-- Conectar eventos de arrastre
local function connectDragEvents(frame)
    frame.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragging = true
            dragStart = input.Position
            startPos = Frame.Position
            
            input.Changed:Connect(function()
                if input.UserInputState == Enum.UserInputState.End then
                    dragging = false
                end
            end)
        end
    end)

    frame.InputChanged:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch then
            dragInput = input
        end
    end)
end

connectDragEvents(TitleBar)
connectDragEvents(BackgroundDrag)

UserInputService.InputChanged:Connect(function(input)
    if input == dragInput and dragging then
        update(input)
    end
end)

-- Función para minimizar/maximizar
local isMinimized = false
local originalSize = Frame.Size
local minimizedSize = UDim2.new(0, 280, 0, 30)

MinimizeButton.MouseButton1Click:Connect(function()
    isMinimized = not isMinimized
    
    if isMinimized then
        local tween = TweenService:Create(
            Frame,
            TweenInfo.new(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            {Size = minimizedSize}
        )
        tween:Play()
        TabContainer.Visible = false
        MainContentContainer.Visible = false
        Creditos.Visible = false
        BackgroundDrag.Visible = false
        MinimizeButton.Text = "+"
    else
        local tween = TweenService:Create(
            Frame,
            TweenInfo.new(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            {Size = originalSize}
        )
        tween:Play()
        TabContainer.Visible = true
        MainContentContainer.Visible = true
        Creditos.Visible = true
        BackgroundDrag.Visible = true
        MinimizeButton.Text = "-"
    end
end)

-- Botón estilo barra
local function CriarBotao(texto, callback, parent)
    local Botao = Instance.new("TextButton")
    Botao.Size = UDim2.new(1, 0, 0, 35)
    Botao.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
    Botao.Text = texto
    Botao.TextColor3 = Color3.fromRGB(255, 255, 255)
    Botao.Font = Enum.Font.SourceSansBold
    Botao.TextSize = 16
    Botao.ZIndex = 1
    Botao.Parent = parent or MainContentContainer
    Instance.new("UICorner", Botao).CornerRadius = UDim.new(0, 6)

    Botao.MouseEnter:Connect(function()
        Botao.BackgroundColor3 = Color3.fromRGB(70, 70, 70)
    end)
    Botao.MouseLeave:Connect(function()
        Botao.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
    end)

    Botao.MouseButton1Click:Connect(callback)
    return Botao
end

-- Toggle (checkbox) CORREGIDO
local function CriarToggle(texto, callback, parent)
    local ToggleContainer = Instance.new("Frame")
    ToggleContainer.Size = UDim2.new(1, 0, 0, 30)
    ToggleContainer.BackgroundTransparency = 1
    ToggleContainer.ZIndex = 1
    ToggleContainer.Parent = parent or MainContentContainer

    local Toggle = Instance.new("TextButton")
    Toggle.Size = UDim2.new(1, 0, 1, 0)
    Toggle.BackgroundTransparency = 1
    Toggle.Text = texto
    Toggle.TextColor3 = Color3.fromRGB(255, 255, 255)
    Toggle.Font = Enum.Font.SourceSansBold
    Toggle.TextSize = 16
    Toggle.TextXAlignment = Enum.TextXAlignment.Left
    Toggle.ZIndex = 1
    Toggle.Parent = ToggleContainer

    local Box = Instance.new("Frame")
    Box.Size = UDim2.new(0, 20, 0, 20)
    Box.Position = UDim2.new(1, -25, 0.5, -10)
    Box.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
    Box.ZIndex = 1
    Box.Parent = ToggleContainer
    Instance.new("UICorner", Box).CornerRadius = UDim.new(0, 4)

    -- Estado inicial
    local isActive = false
    
    local function updateToggle()
        if isActive then
            Box.BackgroundColor3 = Color3.fromRGB(0, 200, 0)
        else
            Box.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
        end
    end
    
    Toggle.MouseButton1Click:Connect(function()
        isActive = not isActive
        updateToggle()
        callback(isActive)
    end)
    
    -- Inicializar
    updateToggle()
    
    return Toggle, Box, function(state) 
        isActive = state 
        updateToggle()
    end
end

-- ===== PESTAÑA PRINCIPAL =====
local function setupMainTab()
    -- Toggle Auto Sombrero CORREGIDO
    local AutoChapeuToggle, AutoChapeuBox, setAutoChapeuState = CriarToggle("Auto Sombrero", function(isActive)
        _G.autoChapeu = isActive
        
        if isActive then
            print("🟢 Auto Sombrero ACTIVADO")
            task.spawn(function()
                while _G.autoChapeu do
                    pcall(function()
                        local args = {400001}
                        game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("RerollOrnament"):InvokeServer(unpack(args))
                    end)
                    task.wait(0.2)
                end
            end)
        else
            print("🔴 Auto Sombrero DESACTIVADO")
        end
    end, tabs["Main"].content)

    -- Toggle Auto Mochila CORREGIDO
    local AutoMochilaToggle, AutoMochilaBox, setAutoMochilaState = CriarToggle("Auto Mochila", function(isActive)
        _G.autoMochila = isActive
        
        if isActive then
            print("🟢 Auto Mochila ACTIVADA")
            task.spawn(function()
                while _G.autoMochila do
                    pcall(function()
                        local args = {400002}
                        game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("RerollOrnament"):InvokeServer(unpack(args))
                    end)
                    task.wait(0.2)
                end
            end)
        else
            print("🔴 Auto Mochila DESACTIVADA")
        end
    end, tabs["Main"].content)
end

-- ===== PESTAÑA FARM =====
local function setupFarmTab()
    -- SISTEMA AUTO FARM (NPC Recolector) CORREGIDO
    local autoFarmSystem = {
        active = false,
        connection = nil,
        
        SETTINGS = {
            NPC_FOLDER_NAMES = {"Enemys"},
            MAX_DISTANCE = 900,
            PULL_DISTANCE = 30,
            LOOP_DELAY = 0.2,
            BUFF_COOLDOWN = 60
        },
        
        lastBuffTime = 0,
        npcFolder = nil,
        
        findNPCDirectory = function(self)
            for _, folderName in ipairs(self.SETTINGS.NPC_FOLDER_NAMES) do
                local folder = workspace:FindFirstChild(folderName)
                if folder then
                    return folder
                end
            end
            return nil
        end,
        
        applyBuffs = function(self)
            if time() - self.lastBuffTime < self.SETTINGS.BUFF_COOLDOWN then
                return
            end
            
            print("[BUFF] Aplicando mejoras...")
            self.lastBuffTime = time()
            
            local character = LocalPlayer.Character
            if character then
                local humanoid = character:FindFirstChild("Humanoid")
                if humanoid then
                    humanoid.WalkSpeed = 90
                    delay(10, function()
                        if humanoid then
                            humanoid.WalkSpeed = 90
                        end
                    end)
                end
            end
        end,
        
        pullNPC = function(self, npcModel, humanoidRootPart)
            if not npcModel or not npcModel:FindFirstChild("HumanoidRootPart") or not humanoidRootPart then
                return false
            end
            
            local npcHRP = npcModel.HumanoidRootPart
            local distance = (humanoidRootPart.Position - npcHRP.Position).Magnitude
            
            if distance > self.SETTINGS.PULL_DISTANCE and distance < self.SETTINGS.MAX_DISTANCE then
                local direction = (humanoidRootPart.Position - npcHRP.Position).Unit
                npcHRP.CFrame = CFrame.new(
                    humanoidRootPart.Position + direction * 5,
                    humanoidRootPart.Position
                )
                return true
            end
            return false
        end,
        
        mainLoop = function(self)
            if not self.active then return end
            
            local character = LocalPlayer.Character
            local humanoidRootPart = character and character:FindFirstChild("HumanoidRootPart")
            
            if not character or not humanoidRootPart then
                return
            end
            
            self:applyBuffs()
            
            if not self.npcFolder then
                self.npcFolder = self:findNPCDirectory()
                if not self.npcFolder then
                    warn("¡No se encontró ninguna carpeta de NPCs!")
                    return
                end
            end
            
            local gathered = 0
            for _, npc in ipairs(self.npcFolder:GetChildren()) do
                if not self.active then break end
                
                if npc:IsA("Model") and npc:FindFirstChild("Humanoid") and npc.Humanoid.Health > 0 then
                    if self:pullNPC(npc, humanoidRootPart) then
                        gathered += 1
                        wait(0.3)
                    end
                end
            end
            
            if gathered > 0 then
                print("[NPC RECOLECTADOS] " .. gathered .. " NPCs reunidos!")
            end
        end,
        
        start = function(self)
            if self.active then return end
            
            self.active = true
            self.npcFolder = nil
            self.lastBuffTime = 0
            
            print("🟢 ¡Auto Farm INICIADO!")
            
            self.connection = RunService.Heartbeat:Connect(function()
                if not self.active then return end
                pcall(function() self:mainLoop() end)
                wait(self.SETTINGS.LOOP_DELAY)
            end)
        end,
        
        stop = function(self)
            if not self.active then return end
            
            self.active = false
            
            if self.connection then
                self.connection:Disconnect()
                self.connection = nil
            end
            
            print("🔴 ¡Auto Farm DETENIDO!")
        end
    }

    
    -- Toggle Auto Farm CORREGIDO
    local AutoFarmToggle, AutoFarmBox, setAutoFarmState = CriarToggle("Auto Farm NPC", function(isActive)
        if isActive then
            autoFarmSystem:start()
        else
            autoFarmSystem:stop()
        end
    end, tabs["Farm"].content)

    -- Botón Auto Click CORREGIDO
    local AutoClickToggle, AutoClickBox, setAutoClickState = CriarToggle("Auto Click", function(isActive)
        _G.autoClick = isActive
        
        if isActive then
            print("🟢 Auto Click ACTIVADO")
            task.spawn(function()
                while _G.autoClick do
                    pcall(function()
                        local args = {
                            {
                                attackEnemyGUID = "3b887f80-7ae5-42ad-8915-73f94f2c87e1"
                            }
                        }
                        game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PlayerClickAttackSkill"):FireServer(unpack(args))
                    end)
                    wait(-999999999999)
                end
            end)
        else
            print("🔴 Auto Click DESACTIVADO")
        end
    end, tabs["Farm"].content)

    local potion1 = CriarBotao("Poción Suerte V1", function()
        pcall(function()
            local args = {
                {
                    id = 10047,
                    count = 5
                }
            }
            game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
            print("✅ ¡Poción de Suerte usada!")
        end)
    end, tabs["Farm"].content)

    local potion2 = CriarBotao("Poción Daño V1", function()
        pcall(function()
            local args = {
                {
                    id = 10048,
                    count = 5
                }
            }
            game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
            print("✅ ¡Poción de Daño usada!")
        end)
    end, tabs["Farm"].content)

    local potion3 = CriarBotao("Poción Oro V1", function()
        pcall(function()
            local args = {
                {
                    id = 10049,
                    count = 5
                }
            }
            game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
            print("✅ ¡Poción de Oro usada!")
        end)
    end, tabs["Farm"].content)

    local potion4 = CriarBotao("Poción Suerte V2", function()
        pcall(function()
            local args = {
                {
                    id = 10050,
                    count = 5
                }
            }
            game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
            print("✅ ¡Poción de Suerte usada!")
        end)
    end, tabs["Farm"].content)

    local potion5 = CriarBotao("Poción Daño V2", function()
        pcall(function()
            local args = {
                {
                    id = 10051,
                    count = 5
                }
            }
            game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
            print("✅ ¡Poción de Daño usada!")
        end)
    end, tabs["Farm"].content)

    local potion6 = CriarBotao("Poción Oro V2", function()
        pcall(function()
            local args = {
                {
                    id = 10052,
                    count = 5
                }
            }
            game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PotionMerge"):InvokeServer(unpack(args))
            print("✅ ¡Poción de Oro usada!")
        end)
    end, tabs["Farm"].content)
end
-- ===== PESTAÑA FARM AVANZADA =====
-- ===== PESTAÑA FARM AVANZADA =====
local function setupFarmAvanzadaTab()
    local autoFarmIman = {
        activo = false,
        conexion = nil,
        npcFolder = nil,
        maxDistance = 40, -- Menor rango para el imán
        minDistance = 8,
        loopDelay = 0.2,
        start = function(self)
            if self.activo then return end
            self.activo = true
            print("🟢 Farm Avanzada (Imán) ACTIVADO")
            self.npcFolder = workspace:FindFirstChild("Enemys")
            self.conexion = RunService.Heartbeat:Connect(function()
                if not self.activo then return end
                if not self.npcFolder then return end
                local character = LocalPlayer.Character
                local humanoidRootPart = character and character:FindFirstChild("HumanoidRootPart")
                if not humanoidRootPart then return end
                for _, npc in ipairs(self.npcFolder:GetChildren()) do
                    if npc:IsA("Model") and npc:FindFirstChild("Humanoid") and npc.Humanoid.Health > 0 and npc:FindFirstChild("HumanoidRootPart") then
                        local npcHRP = npc.HumanoidRootPart
                        local distancia = (humanoidRootPart.Position - npcHRP.Position).Magnitude
                        if distancia < self.maxDistance and distancia > self.minDistance then
                            local direccion = (humanoidRootPart.Position - npcHRP.Position).Unit
                            npcHRP.CFrame = CFrame.new(
                                humanoidRootPart.Position + direccion * self.minDistance,
                                humanoidRootPart.Position
                            )
                        end
                    end
                end
                wait(self.loopDelay)
            end)
        end,
        stop = function(self)
            if not self.activo then return end
            self.activo = false
            if self.conexion then
                self.conexion:Disconnect()
                self.conexion = nil
            end
            print("🔴 Farm Avanzada (Imán) DESACTIVADO")
        end
    }

    local FarmAvanzadaToggle, FarmAvanzadaBox, setFarmAvanzadaState = CriarToggle("Farm Avanzada (Imán)", function(isActive)
        if isActive then
            autoFarmIman:start()
        else
            autoFarmIman:stop()
        end
    end, tabs["Farm Avanzada"].content)

    -- Botón para TP al NPC más cercano
    local tpBtn = CriarBotao("TP al NPC más cercano", function()
        local npcFolder = workspace:FindFirstChild("Enemys")
        local character = LocalPlayer.Character
        local humanoidRootPart = character and character:FindFirstChild("HumanoidRootPart")
        if not npcFolder or not humanoidRootPart then return end

        local npcMasCercano = nil
        local menorDistancia = math.huge
        for _, npc in ipairs(npcFolder:GetChildren()) do
            if npc:IsA("Model") and npc:FindFirstChild("Humanoid") and npc.Humanoid.Health > 0 and npc:FindFirstChild("HumanoidRootPart") then
                local npcHRP = npc.HumanoidRootPart
                local distancia = (humanoidRootPart.Position - npcHRP.Position).Magnitude
                if distancia < menorDistancia then
                    menorDistancia = distancia
                    npcMasCercano = npcHRP
                end
            end
        end

        if npcMasCercano then
            humanoidRootPart.CFrame = npcMasCercano.CFrame + Vector3.new(2, 0, 0) -- Te deja al lado del NPC
            print("✅ Teletransportado al NPC más cercano.")
        else
            print("❌ No hay NPCs válidos cerca.")
        end
    end, tabs["Farm Avanzada"].content)
end

-- ===== PESTAÑA AUTOMÁTICO =====
local function setupAutoTab()
    -- Toggle Auto Raid Mundo 3 CORREGIDO
    local AutoRaidW3Toggle, AutoRaidW3Box, setAutoRaidW3State = CriarToggle("Auto Raid Mundo 3", function(isActive)
        _G.autoRaidW3 = isActive
        
        if isActive then
            print("🟢 Auto Raid M3 ACTIVADO")
            task.spawn(function()
                while _G.autoRaidW3 do
                    pcall(function()
                        local args = {[1] = 1000001}
                        game:GetService("ReplicatedStorage").Remotes.EnterCityRaidMap:FireServer(unpack(args))
                    end)
                    task.wait(80.0)
                end
            end)
        else
            print("🔴 Auto Raid M3 DESACTIVADO")
        end
    end, tabs["Auto"].content)

    -- Toggle Auto Raid Mundo 7 CORREGIDO
    local AutoRaidW7Toggle, AutoRaidW7Box, setAutoRaidW7State = CriarToggle("Auto Raid Mundo 7", function(isActive)
        _G.autoRaidW7 = isActive
        
        if isActive then
            print("🟢 Auto Raid M7 ACTIVADO")
            task.spawn(function()
                while _G.autoRaidW7 do
                    pcall(function()
                        local args = {[1] = 1000002}
                        game:GetService("ReplicatedStorage").Remotes.EnterCityRaidMap:FireServer(unpack(args))
                    end)
                    task.wait(80.0)
                end
            end)
        else
            print("🔴 Auto Raid M7 DESACTIVADO")
        end
    end, tabs["Auto"].content)
    
local collect1 = CriarBotao("auto recolectar", function()
    if autoCollectActive then
        -- Apagar
        autoCollectActive = false
        if autoCollectConnection then
            autoCollectConnection:Disconnect()
            autoCollectConnection = nil
        end
        print("🔴 ¡Auto Recolectar desactivado!")
    else
        -- Encender
        autoCollectActive = true
        local Players = game:GetService("Players")
        local LocalPlayer = Players.LocalPlayer
        local Workspace = game:GetService("Workspace")
        
        if not LocalPlayer.Character then
            LocalPlayer.CharacterAdded:Wait()
        end
        
        local Character = LocalPlayer.Character
        local RootPart = Character:WaitForChild("HumanoidRootPart")
        local Golds = Workspace:WaitForChild("Golds")

        autoCollectConnection = RunService.Heartbeat:Connect(function()
            if not autoCollectActive then return end
            
            for _, part in ipairs(Golds:GetChildren()) do
                if part:IsA("BasePart") then
                    part.CFrame = RootPart.CFrame + Vector3.new(0, 3, 0)
                end
            end
        end)
        print("🟢 ¡Auto Recolectar activado!")
    end
end, tabs["Auto"].content)

local autoraid0 = CriarBotao("auto raid beta", function()
loadstring(game:HttpGet("https://raw.githubusercontent.com/RN-TEAM-2758/Auto-raid-teste/refs/heads/main/script.js"))()
end, tabs["Auto"].content)
end

-- ===== PESTAÑA JUGADOR =====
local function setupPlayerTab()
    -- Caja de Velocidad de Caminata
    local WalkContainer = Instance.new("Frame")
    WalkContainer.Size = UDim2.new(1, 0, 0, 30)
    WalkContainer.BackgroundTransparency = 1
    WalkContainer.ZIndex = 1
    WalkContainer.Parent = tabs["Player"].content

    local WalkLabel = Instance.new("TextLabel")
    WalkLabel.Size = UDim2.new(0.6, 0, 1, 0)
    WalkLabel.BackgroundTransparency = 1
    WalkLabel.Text = "Velocidad"
    WalkLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    WalkLabel.Font = Enum.Font.SourceSansBold
    WalkLabel.TextSize = 16
    WalkLabel.TextXAlignment = Enum.TextXAlignment.Left
    WalkLabel.ZIndex = 1
    WalkLabel.Parent = WalkContainer

    local WalkBox = Instance.new("TextBox")
    WalkBox.Size = UDim2.new(0.35, 0, 1, 0)
    WalkBox.Position = UDim2.new(0.62, 0, 0, 0)
    WalkBox.BackgroundColor3 = Color3.fromRGB(60, 60, 60)
    WalkBox.BorderSizePixel = 0
    WalkBox.Text = "16"
    WalkBox.PlaceholderText = "0-120"
    WalkBox.TextColor3 = Color3.fromRGB(255, 255, 255)
    WalkBox.Font = Enum.Font.SourceSansBold
    WalkBox.TextSize = 14
    WalkBox.ZIndex = 1
    WalkBox.Parent = WalkContainer
    Instance.new("UICorner", WalkBox).CornerRadius = UDim.new(0, 6)

    -- Efectos visuales en WalkBox
    WalkBox.Focused:Connect(function()
        local tween = TweenService:Create(
            WalkBox,
            TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            {BackgroundColor3 = Color3.fromRGB(80, 80, 80)}
        )
        tween:Play()
    end)

    WalkBox.FocusLost:Connect(function()
        local tween = TweenService:Create(
            WalkBox,
            TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            {BackgroundColor3 = Color3.fromRGB(60, 60, 60)}
        )
        tween:Play()
        
        local val = tonumber(WalkBox.Text)
        if val then
            if val >= 0 and val <= 120 then
                local character = LocalPlayer.Character
                if character and character:FindFirstChild("Humanoid") then
                    character.Humanoid.WalkSpeed = val
                    print("🟢 Velocidad de Caminata: " .. val)
                end
            else
                WalkBox.Text = "16"
                local character = LocalPlayer.Character
                if character and character:FindFirstChild("Humanoid") then
                    character.Humanoid.WalkSpeed = 16
                end
            end
        else
            WalkBox.Text = "16"
        end
    end)

    -- Sistema de Tamaño de Hitbox (CORREGIDO - igual a tu ejemplo)
    local HitboxContainer = Instance.new("Frame")
    HitboxContainer.Size = UDim2.new(1, 0, 0, 30)
    HitboxContainer.BackgroundTransparency = 1
    HitboxContainer.ZIndex = 1
    HitboxContainer.Parent = tabs["Player"].content

    local HitboxLabel = Instance.new("TextLabel")
    HitboxLabel.Size = UDim2.new(0.6, 0, 1, 0)
    HitboxLabel.BackgroundTransparency = 1
    HitboxLabel.Text = "Kill Aura"
    HitboxLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    HitboxLabel.Font = Enum.Font.SourceSansBold
    HitboxLabel.TextSize = 16
    HitboxLabel.TextXAlignment = Enum.TextXAlignment.Left
    HitboxLabel.ZIndex = 1
    HitboxLabel.Parent = HitboxContainer

    local HitboxBox = Instance.new("TextBox")
    HitboxBox.Size = UDim2.new(0.35, 0, 1, 0)
    HitboxBox.Position = UDim2.new(0.62, 0, 0, 0)
    HitboxBox.BackgroundColor3 = Color3.fromRGB(60, 60, 60)
    HitboxBox.BorderSizePixel = 0
    HitboxBox.Text = "60"
    HitboxBox.PlaceholderText = "0-2000"
    HitboxBox.TextColor3 = Color3.fromRGB(255, 255, 255)
    HitboxBox.Font = Enum.Font.SourceSansBold
    HitboxBox.TextSize = 14
    HitboxBox.ZIndex = 1
    HitboxBox.Parent = HitboxContainer
    Instance.new("UICorner", HitboxBox).CornerRadius = UDim.new(0, 6)

    -- Efectos visuales en HitboxBox
    HitboxBox.Focused:Connect(function()
        local tween = TweenService:Create(
            HitboxBox,
            TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            {BackgroundColor3 = Color3.fromRGB(80, 80, 80)}
        )
        tween:Play()
    end)

    HitboxBox.FocusLost:Connect(function()
        local tween = TweenService:Create(
            HitboxBox,
            TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            {BackgroundColor3 = Color3.fromRGB(60, 60, 60)}
        )
        tween:Play()
        
        local val = tonumber(HitboxBox.Text)
        if val then
            if val == 0 then
                print("🔴 Kill Aura DESACTIVADA")
                _G.HitboxEnabled = false
            elseif val > 0 and val <= 2000 then
                _G.HitboxSize = val
                _G.HitboxEnabled = true
                print("🟢 Kill Aura: " .. val)
            else
                HitboxBox.Text = "60"
                _G.HitboxSize = 60
            end
        else
            HitboxBox.Text = "0"
            _G.HitboxSize = 60
        end
    end)

    -- Configuración del sistema de Hitbox
    _G.HitboxSize = 60
    _G.HitboxEnabled = true
    _G.NPCFolder = workspace:FindFirstChild("Enemys") -- Carpeta donde están los NPCs

    -- Función para modificar la HumanoidRootPart de los NPCs (solo tamaño)
    local function modifyNPCs()
        if _G.NPCFolder then
            for _, npc in pairs(_G.NPCFolder:GetChildren()) do
                if npc:IsA("Model") and npc:FindFirstChild("HumanoidRootPart") then
                    pcall(function()
                        if _G.HitboxEnabled then
                            npc.HumanoidRootPart.Size = Vector3.new(_G.HitboxSize, _G.HitboxSize, _G.HitboxSize)
                            npc.HumanoidRootPart.CanCollide = false
                        else
                            -- Restaura el tamaño original cuando está desactivado
                            npc.HumanoidRootPart.Size = Vector3.new(2, 2, 1)
                            npc.HumanoidRootPart.CanCollide = true
                        end
                    end)
                end
            end
        end
    end

    -- Bucle para modificar los NPCs continuamente
    game:GetService('RunService').RenderStepped:Connect(function()
        pcall(function()
            modifyNPCs()
        end)
    end)

local noclipBtn = CriarBotao("noclip", function()
    pcall(function()
        -- Script de Noclip Automático
        local Player = game.Players.LocalPlayer
        local Character = Player.Character or Player.CharacterAdded:Wait()

        -- Esperar a que el personaje aparezca
        if not Character then
            Character = Player.CharacterAdded:Wait()
        end

        -- Función para activar noclip
        local function EnableNoclip()
            print("¡Noclip ACTIVADO automáticamente!")
            
            -- Conexión permanente para noclip
            local noclipConnection
            noclipConnection = game:GetService("RunService").Stepped:Connect(function()
                if Character and Character:FindFirstChild("Humanoid") then
                    for _, part in pairs(Character:GetDescendants()) do
                        if part:IsA("BasePart") then
                            part.CanCollide = false
                        end
                    end
                else
                    -- Si el personaje muere, reconectar cuando reaparezca
                    noclipConnection:Disconnect()
                    wait(2)
                    Character = Player.CharacterAdded:Wait()
                    EnableNoclip()
                end
            end)
        end

        -- Activar noclip inmediatamente
        EnableNoclip()

        -- Mensaje de confirmación
        print("¡Noclip está activo! Puedes atravesar paredes.")
    end)
end, tabs["Player"].content)
end

-- Crear las pestañas
tabs["Main"] = createTab("Main")
tabs["Farm"] = createTab("Farm")
tabs["Farm Avanzada"] = createTab("Farm Avanzada")
tabs["Auto"] = createTab("Auto")
tabs["Player"] = createTab("Player")

-- Configurar todas las pestañas
setupMainTab()
setupFarmTab()
setupAutoTab()
setupPlayerTab()
setupFarmAvanzadaTab()


-- Conectar eventos de layout para ajustar altura
for _, tab in pairs(tabs) do
    tab.layout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
        if currentTab then
            ajustarAlturaJanela()
        end
    end)
end

-- Sistema de desplazamiento suave con el ratón
local function setupSmoothScrolling()
    UserInputService.InputChanged:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseWheel then
            if currentTab and tabs[currentTab] then
                local currentCanvasPosition = MainContentContainer.CanvasPosition
                local newCanvasPosition = currentCanvasPosition - Vector2.new(0, input.Position.Z * 20)
                
                local maxCanvasPosition = MainContentContainer.CanvasSize.Y.Offset - MainContentContainer.AbsoluteWindowSize.Y
                
                if newCanvasPosition.Y < 0 then
                    newCanvasPosition = Vector2.new(0, 0)
                elseif newCanvasPosition.Y > maxCanvasPosition then
                    newCanvasPosition = Vector2.new(0, maxCanvasPosition)
                end
                
                MainContentContainer.CanvasPosition = newCanvasPosition
            end
        end
    end)
end

setupSmoothScrolling()

-- Activar la primera pestaña por defecto
if tabs["Main"] then
    tabs["Main"].button:MouseButton1Click()
end

-- Inicializar variables globales
_G.autoChapeu = false
_G.autoMochila = false
_G.autoRaidW3 = false
_G.autoRaidW7 = false
_G.autoClick = false
_G.HitboxSize = 60
_G.HitboxEnabled = true

print("🚀 ¡INTERFAZ RN TEAM CARGADA!")
print("✅ ¡Sistema de Hitbox/Kill Aura funcionando perfectamente!")

