"use client"

import React, { useState } from 'react'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar } from '@/components/ui/calendar'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// Custom Components
import AnimatedHeading from '@/components/animated-heading'
import DotGridShader from '@/components/DotGridShader'
import LiveClock from '@/components/live-clock'
import ProjectCard from '@/components/project-card'
import RevealOnView from '@/components/reveal-on-view'
import ShowcaseCarousel from '@/components/showcase-carousel'
import Logo from '@/components/ui/logo/Logo'

// Icons
import { AlertCircle, ChevronRight, Home, Menu, Search, Settings, User, X, Bold, Italic, Underline } from 'lucide-react'

export default function AboutPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [progress, setProgress] = useState(45)
  const [sliderValue, setSliderValue] = useState([50])
  const [switchChecked, setSwitchChecked] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12 text-center">
            <AnimatedHeading 
              lines={["Component", "Showcase"]}
              className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            />
            <p className="mt-4 text-gray-600 dark:text-gray-400">All components in one place</p>
          </div>
          
          <div className="space-y-12">
            
            {/* Custom Components Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                🎨 Custom Components
              </h2>
              
              <div className="space-y-8">
                {/* Logo */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Logo</h3>
                  <Logo />
                </div>

                {/* Animated Heading */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Animated Heading</h3>
                  <AnimatedHeading 
                    lines={["Hello", "World"]}
                    className="text-4xl font-bold"
                  />
                </div>

                {/* Live Clock */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Live Clock</h3>
                  <LiveClock className="text-lg font-mono" />
                </div>

                {/* DotGrid Shader */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">DotGrid Shader</h3>
                  <div className="h-48 rounded-lg overflow-hidden">
                    <DotGridShader />
                  </div>
                </div>

                {/* Project Card */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Project Card</h3>
                  <ProjectCard 
                    title="Sample Project"
                    subtitle="A demo project card"
                    imageSrc="/placeholder.svg?height=400&width=600"
                    tags={["React", "TypeScript", "Tailwind"]}
                    href="#"
                  />
                </div>

                {/* Reveal on View */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Reveal on View</h3>
                  <RevealOnView>
                    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
                      This content reveals on scroll!
                    </div>
                  </RevealOnView>
                </div>
              </div>
            </section>

            {/* Buttons & Actions */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                🔘 Buttons & Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button>
                  <Search className="mr-2 h-4 w-4" /> With Icon
                </Button>
              </div>
            </section>

            {/* Form Elements */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                📝 Form Elements
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <Label htmlFor="input">Input</Label>
                  <Input id="input" placeholder="Enter text..." />
                </div>

                {/* Textarea */}
                <div>
                  <Label htmlFor="textarea">Textarea</Label>
                  <Textarea id="textarea" placeholder="Enter longer text..." />
                </div>

                {/* Select */}
                <div>
                  <Label>Select</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="checkbox" />
                  <Label htmlFor="checkbox">Accept terms and conditions</Label>
                </div>

                {/* Radio Group */}
                <div>
                  <Label>Radio Group</Label>
                  <RadioGroup defaultValue="option1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="r1" />
                      <Label htmlFor="r1">Option 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="r2" />
                      <Label htmlFor="r2">Option 2</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Switch */}
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="switch" 
                    checked={switchChecked}
                    onCheckedChange={setSwitchChecked}
                  />
                  <Label htmlFor="switch">Enable notifications</Label>
                </div>

                {/* Slider */}
                <div>
                  <Label>Slider ({sliderValue[0]})</Label>
                  <Slider 
                    value={sliderValue} 
                    onValueChange={setSliderValue}
                    max={100} 
                    step={1} 
                  />
                </div>

                {/* Toggle */}
                <div>
                  <Label>Toggle</Label>
                  <div className="flex gap-2">
                    <Toggle>
                      <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle>
                      <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle>
                      <Underline className="h-4 w-4" />
                    </Toggle>
                  </div>
                </div>

                {/* Toggle Group */}
                <div>
                  <Label>Toggle Group</Label>
                  <ToggleGroup type="single">
                    <ToggleGroupItem value="a">A</ToggleGroupItem>
                    <ToggleGroupItem value="b">B</ToggleGroupItem>
                    <ToggleGroupItem value="c">C</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </section>

            {/* Cards & Content */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                🎴 Cards & Content
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description goes here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This is the card content area where you can add any content.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Action</Button>
                  </CardFooter>
                </Card>

                {/* Alert */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Alert Title</AlertTitle>
                  <AlertDescription>
                    This is an alert description with important information.
                  </AlertDescription>
                </Alert>

                {/* Badge Examples */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                {/* Avatar */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Avatar</h3>
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Progress</h3>
                  <Progress value={progress} />
                  <Button onClick={() => setProgress((p) => (p + 10) % 110)}>
                    Increase Progress
                  </Button>
                </div>

                {/* Skeleton */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Skeleton Loading</h3>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            </section>

            {/* Navigation Components */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                🧭 Navigation
              </h2>
              
              <div className="space-y-6">
                {/* Tabs */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tabs</h3>
                  <Tabs defaultValue="tab1">
                    <TabsList>
                      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                      <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">Content for Tab 1</TabsContent>
                    <TabsContent value="tab2">Content for Tab 2</TabsContent>
                    <TabsContent value="tab3">Content for Tab 3</TabsContent>
                  </Tabs>
                </div>

                {/* Breadcrumb */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Breadcrumb</h3>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Components</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Showcase</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                {/* Navigation Menu */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Navigation Menu</h3>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <NavigationMenuLink>Product 1</NavigationMenuLink>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <NavigationMenuLink>Service 1</NavigationMenuLink>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>

                {/* Menubar */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Menubar</h3>
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger>File</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>New File</MenubarItem>
                        <MenubarItem>Open</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Exit</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                      <MenubarTrigger>Edit</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>Undo</MenubarItem>
                        <MenubarItem>Redo</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
              </div>
            </section>

            {/* Overlays & Modals */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                🎭 Overlays & Modals
              </h2>
              
              <div className="flex flex-wrap gap-4">
                {/* Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>
                        This is a dialog description.
                      </DialogDescription>
                    </DialogHeader>
                    <p>Dialog content goes here.</p>
                  </DialogContent>
                </Dialog>
                </div>
                </section>
                </div>
                </div>
                </div>
                </TooltipProvider>
  );
}

