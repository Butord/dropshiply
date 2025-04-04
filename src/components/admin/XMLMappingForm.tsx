
import { useState, useEffect } from 'react';
import { XMLMapping } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Info, Plus, Save, X, Zap, AlertCircle, Check, Wand2, Code, Eye, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface XMLMappingFormProps {
  initialMapping?: XMLMapping;
  onSave: (mapping: XMLMapping) => void;
  onCancel?: () => void;
  onAnalyze?: (url: string) => Promise<any>;
  sourceUrl?: string;
  sampleXML?: string;
}

export const XMLMappingForm = ({ 
  initialMapping, 
  onSave, 
  onCancel, 
  onAnalyze,
  sourceUrl,
  sampleXML 
}: XMLMappingFormProps) => {
  const [mapping, setMapping] = useState<XMLMapping>(
    initialMapping || {
      rootElement: '',
      productElement: '',
      fieldMappings: {
        name: '',
        price: '',
      },
      transforms: {},
    }
  );

  const [activeTab, setActiveTab] = useState('basic');
  const [transformField, setTransformField] = useState<string>('');
  const [transformType, setTransformType] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [xmlAnalysis, setXmlAnalysis] = useState<any>(null);
  const [showSampleData, setShowSampleData] = useState(false);

  // Автоматично аналізувати XML, якщо є URL і функція аналізу
  useEffect(() => {
    if (sourceUrl && onAnalyze && !initialMapping?.rootElement) {
      handleAnalyzeXml();
    }
  }, [sourceUrl, onAnalyze]);

  const handleFieldMappingChange = (field: string, value: string) => {
    setMapping({
      ...mapping,
      fieldMappings: {
        ...mapping.fieldMappings,
        [field]: value,
      },
    });
  };

  const handleAddTransform = () => {
    if (!transformField || !transformType) return;

    setMapping({
      ...mapping,
      transforms: {
        ...mapping.transforms,
        [transformField]: {
          type: transformType as any,
          pattern: '',
          replacement: '',
        },
      },
    });

    setTransformField('');
    setTransformType('');
  };

  const handleTransformChange = (field: string, property: string, value: string) => {
    if (!mapping.transforms) return;

    setMapping({
      ...mapping,
      transforms: {
        ...mapping.transforms,
        [field]: {
          ...mapping.transforms[field],
          [property]: value,
        },
      },
    });
  };

  const handleRemoveTransform = (field: string) => {
    if (!mapping.transforms) return;

    const newTransforms = { ...mapping.transforms };
    delete newTransforms[field];

    setMapping({
      ...mapping,
      transforms: newTransforms,
    });
  };

  const handleAnalyzeXml = async () => {
    if (!sourceUrl || !onAnalyze) return;
    
    try {
      setAnalyzing(true);
      const result = await onAnalyze(sourceUrl);
      
      if (result.success) {
        setXmlAnalysis(result);
        setActiveTab('analysis');
        toast({
          title: "Аналіз завершено",
          description: "XML файл проаналізовано успішно, знайдено структуру та рекомендації",
        });
      } else {
        toast({
          title: "Помилка аналізу",
          description: result.errorMessage || "Не вдалося проаналізувати XML",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Помилка аналізу XML:", error);
      toast({
        title: "Помилка",
        description: "Сталася помилка під час аналізу XML",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const applyMappingSuggestion = () => {
    if (!xmlAnalysis || !xmlAnalysis.suggestions) return;
    
    const { schema } = xmlAnalysis.suggestions;
    
    setMapping({
      ...mapping,
      rootElement: schema.rootElement,
      productElement: schema.productElement,
      fieldMappings: {
        ...schema.fieldMappings,
      },
    });
    
    setActiveTab('basic');
    
    toast({
      title: "Мапінг застосовано",
      description: "Рекомендований мапінг було успішно застосовано",
    });
  };

  const handleSave = () => {
    // Basic validation
    if (!mapping.rootElement || !mapping.productElement || !mapping.fieldMappings.name || !mapping.fieldMappings.price) {
      toast({
        title: "Помилка валідації",
        description: "Будь ласка, заповніть всі обов'язкові поля (Кореневий елемент, Елемент товару, Назва та Ціна)",
        variant: "destructive",
      });
      return;
    }

    onSave(mapping);
  };

  const fieldLabels: Record<string, string> = {
    id: 'ID товару',
    name: 'Назва товару',
    description: 'Опис',
    price: 'Ціна',
    compareAtPrice: 'Стара ціна',
    images: 'Зображення',
    category: 'Категорія',
    categoryIdToName: 'ID категорії',
    tags: 'Теги',
    sku: 'Артикул / SKU',
    stock: 'Наявність',
  };

  const requiredFields = ['name', 'price'];

  return (
    <div className="space-y-6 p-1">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="analysis">
            <Zap className="h-4 w-4 mr-2" />
            Аналіз XML
          </TabsTrigger>
          <TabsTrigger value="basic">
            <Code className="h-4 w-4 mr-2" />
            Основне мапінг
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Eye className="h-4 w-4 mr-2" />
            Додаткові поля
          </TabsTrigger>
          <TabsTrigger value="transforms">
            <Wand2 className="h-4 w-4 mr-2" />
            Трансформації
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {sourceUrl && onAnalyze && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Аналіз XML структури</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={analyzing}
                      onClick={handleAnalyzeXml}
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Аналізуємо...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Аналізувати XML
                        </>
                      )}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Автоматичний аналіз структури XML файлу для спрощення налаштування імпорту
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!xmlAnalysis ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Підказка</AlertTitle>
                      <AlertDescription>
                        Натисніть кнопку "Аналізувати XML", щоб автоматично проаналізувати структуру
                        файлу та отримати рекомендації для мапінгу.
                      </AlertDescription>
                    </Alert>
                  ) : xmlAnalysis.suggestions ? (
                    <div className="space-y-4">
                      <Alert variant="default" className="bg-primary/5 border-primary/20">
                        <Check className="h-4 w-4 text-primary" />
                        <AlertTitle>Аналіз успішний</AlertTitle>
                        <AlertDescription>
                          Знайдено {xmlAnalysis.suggestions.productCount} товарів та запропоновано схему мапінгу
                          з рівнем впевненості {xmlAnalysis.suggestions.confidence}%.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="bg-muted p-4 rounded-md">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">Рекомендована схема:</h3>
                          <Button onClick={applyMappingSuggestion} size="sm" variant="default">
                            <Wand2 className="h-4 w-4 mr-2" />
                            Застосувати
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Кореневий елемент</Label>
                            <div className="font-mono text-sm bg-background p-2 rounded border mt-1">
                              {xmlAnalysis.suggestions.schema.rootElement}
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Елемент товару</Label>
                            <div className="font-mono text-sm bg-background p-2 rounded border mt-1">
                              {xmlAnalysis.suggestions.schema.productElement}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">Знайдені поля</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(xmlAnalysis.suggestions.schema.fieldMappings).map(([fieldType, fieldName]) => (
                              <div key={fieldType} className="flex items-center text-sm">
                                <span className="font-medium mr-2">{fieldLabels[fieldType] || fieldType}:</span>
                                <code className="bg-background py-0.5 px-1.5 rounded text-xs border">
                                  {fieldName as string}
                                </code>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Приклад даних:</h3>
                          <Button 
                            onClick={() => setShowSampleData(!showSampleData)} 
                            variant="ghost" 
                            size="sm"
                          >
                            {showSampleData ? 'Сховати' : 'Показати'}
                          </Button>
                        </div>
                        
                        {showSampleData && xmlAnalysis.suggestions.sampleData && (
                          <div className="border rounded-md overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {Object.keys(xmlAnalysis.suggestions.sampleData[0] || {}).map(field => (
                                    <TableHead key={field}>
                                      {fieldLabels[field] || field}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {xmlAnalysis.suggestions.sampleData.map((item: any, index: number) => (
                                  <TableRow key={index}>
                                    {Object.entries(item).map(([field, value]) => (
                                      <TableCell key={field} className="truncate max-w-[200px]">
                                        {value as string}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Не вдалося проаналізувати</AlertTitle>
                      <AlertDescription>
                        {xmlAnalysis.errorMessage || "Не вдалося знайти структуру товарів у XML файлі"}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="rootElement">XML Root Element</Label>
              <Input
                id="rootElement"
                value={mapping.rootElement}
                onChange={(e) => setMapping({ ...mapping, rootElement: e.target.value })}
                placeholder="e.g. products, items, catalog"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="productElement">Product Element</Label>
              <Input
                id="productElement"
                value={mapping.productElement}
                onChange={(e) => setMapping({ ...mapping, productElement: e.target.value })}
                placeholder="e.g. product, item"
                className="mt-1"
              />
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <Label htmlFor="name" className="flex items-center">
                Product Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="name"
                value={mapping.fieldMappings.name}
                onChange={(e) => handleFieldMappingChange('name', e.target.value)}
                placeholder="e.g. title, name, product_name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="price" className="flex items-center">
                Price <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="price"
                value={mapping.fieldMappings.price}
                onChange={(e) => handleFieldMappingChange('price', e.target.value)}
                placeholder="e.g. price, regular_price"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={mapping.fieldMappings.description || ''}
                onChange={(e) => handleFieldMappingChange('description', e.target.value)}
                placeholder="e.g. description, product_description"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="images">Images (comma-separated paths)</Label>
              <Input
                id="images"
                value={mapping.fieldMappings.images || ''}
                onChange={(e) => handleFieldMappingChange('images', e.target.value)}
                placeholder="e.g. image, image_url, images/image"
                className="mt-1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="id">Product ID</Label>
              <Input
                id="id"
                value={mapping.fieldMappings.id || ''}
                onChange={(e) => handleFieldMappingChange('id', e.target.value)}
                placeholder="e.g. id, product_id"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="compareAtPrice">Compare-at Price</Label>
              <Input
                id="compareAtPrice"
                value={mapping.fieldMappings.compareAtPrice || ''}
                onChange={(e) => handleFieldMappingChange('compareAtPrice', e.target.value)}
                placeholder="e.g. compare_price, list_price"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={mapping.fieldMappings.category || ''}
                onChange={(e) => handleFieldMappingChange('category', e.target.value)}
                placeholder="e.g. category, product_type"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="categoryIdToName">Category ID to Name Mapping</Label>
              <Input
                id="categoryIdToName"
                value={mapping.fieldMappings.categoryIdToName || ''}
                onChange={(e) => handleFieldMappingChange('categoryIdToName', e.target.value)}
                placeholder="e.g. categories/category"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use this when your XML has category IDs that need to be mapped to category names
              </p>
            </div>
            
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={mapping.fieldMappings.tags || ''}
                onChange={(e) => handleFieldMappingChange('tags', e.target.value)}
                placeholder="e.g. tags, keywords"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={mapping.fieldMappings.sku || ''}
                onChange={(e) => handleFieldMappingChange('sku', e.target.value)}
                placeholder="e.g. sku, article, product_code"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                value={mapping.fieldMappings.stock || ''}
                onChange={(e) => handleFieldMappingChange('stock', e.target.value)}
                placeholder="e.g. stock, inventory, quantity"
                className="mt-1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transforms" className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 mb-4 flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Transformations allow you to clean and format values from XML. For example, removing currency symbols from prices or splitting comma-separated tags.
            </p>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <div className="flex-1">
              <Select value={transformField} onValueChange={setTransformField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fieldLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select value={transformType} onValueChange={setTransformType}>
                <SelectTrigger>
                  <SelectValue placeholder="Transform type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regex">Regex Replace</SelectItem>
                  <SelectItem value="replace">Simple Replace</SelectItem>
                  <SelectItem value="split">Split Text</SelectItem>
                  <SelectItem value="join">Join Array</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleAddTransform} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {mapping.transforms && Object.entries(mapping.transforms).map(([field, transform]) => (
              <div key={field} className="bg-background border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{fieldLabels[field] || field}</h4>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveTransform(field)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {transform.type === 'regex' && (
                    <>
                      <div>
                        <Label>Pattern (regex)</Label>
                        <Input
                          value={transform.pattern || ''}
                          onChange={(e) => handleTransformChange(field, 'pattern', e.target.value)}
                          placeholder="e.g. [^0-9.]"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Replacement</Label>
                        <Input
                          value={transform.replacement || ''}
                          onChange={(e) => handleTransformChange(field, 'replacement', e.target.value)}
                          placeholder="e.g. (empty for removal)"
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                  
                  {transform.type === 'replace' && (
                    <>
                      <div>
                        <Label>Search Text</Label>
                        <Input
                          value={transform.pattern || ''}
                          onChange={(e) => handleTransformChange(field, 'pattern', e.target.value)}
                          placeholder="e.g. $"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Replacement</Label>
                        <Input
                          value={transform.replacement || ''}
                          onChange={(e) => handleTransformChange(field, 'replacement', e.target.value)}
                          placeholder="e.g. (empty for removal)"
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                  
                  {transform.type === 'split' && (
                    <div>
                      <Label>Separator</Label>
                      <Input
                        value={transform.separator || ''}
                        onChange={(e) => handleTransformChange(field, 'separator', e.target.value)}
                        placeholder="e.g. , or |"
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  {transform.type === 'join' && (
                    <div>
                      <Label>Separator</Label>
                      <Input
                        value={transform.separator || ''}
                        onChange={(e) => handleTransformChange(field, 'separator', e.target.value)}
                        placeholder="e.g. , or |"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {mapping.transforms && Object.keys(mapping.transforms).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No transformations added yet
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Mapping
        </Button>
      </div>
    </div>
  );
};

export default XMLMappingForm;
