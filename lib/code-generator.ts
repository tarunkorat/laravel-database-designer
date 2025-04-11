// Function to generate Laravel migration code
export function generateMigrationCode(model) {
  const tableName = model.tableName || `${model.name.toLowerCase()}s`
  const className = `Create${tableName.charAt(0).toUpperCase() + tableName.slice(1)}Table`

  const fieldsCode = model.fields
    .map((field) => {
      let code = `            $table->${field.type}('${field.name}'`

      // Add length/precision if specified
      if (field.length && ["string", "char", "decimal"].includes(field.type)) {
        if (field.type === "decimal") {
          const [precision, scale] = field.length.split(",")
          code += `, ${precision}, ${scale || 2}`
        } else {
          code += `, ${field.length}`
        }
      }

      code += ")"

      // Add modifiers
      if (field.nullable) code += "->nullable()"
      if (field.unique) code += "->unique()"
      if (field.index) code += "->index()"
      if (field.default) code += `->default(${field.default})`

      code += ";"
      return code
    })
    .join("\n")

  // Add timestamps and soft deletes
  let additionalCode = ""
  if (model.timestamps) {
    additionalCode += "            $table->timestamps();\n"
  }
  if (model.softDeletes) {
    additionalCode += "            $table->softDeletes();\n"
  }

  // Add foreign keys for belongsTo relationships
  const foreignKeys = model.relationships
    .filter((rel) => rel.type === "belongsTo")
    .map((rel) => {
      const foreignKey = rel.foreignKey || `${rel.relatedModel.toLowerCase()}_id`
      return `            $table->foreignId('${foreignKey}')->constrained('${rel.relatedModel.toLowerCase()}s')->onDelete('cascade');`
    })
    .join("\n")

  return `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('${tableName}', function (Blueprint $table) {
            $table->id();
${fieldsCode}
${foreignKeys}
${additionalCode}        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('${tableName}');
    }
};`
}

// Function to generate Laravel model code
export function generateModelCode(model, allModels) {
  const tableName = model.tableName ? `protected $table = '${model.tableName}';` : ""

  // Generate relationship methods
  const relationships = model.relationships
    .map((rel) => {
      const relatedModel = rel.relatedModel
      const foreignKey = rel.foreignKey || ""
      const localKey = rel.localKey || ""
      const pivotTable = rel.pivotTable || ""

      let methodParams = ""
      if (foreignKey) methodParams += `, '${foreignKey}'`
      if (localKey) methodParams += `, '${localKey}'`

      switch (rel.type) {
        case "hasOne":
          return `
    public function ${relatedModel.toLowerCase()}()
    {
        return $this->hasOne(${relatedModel}::class${methodParams});
    }`
        case "hasMany":
          return `
    public function ${relatedModel.toLowerCase()}s()
    {
        return $this->hasMany(${relatedModel}::class${methodParams});
    }`
        case "belongsTo":
          return `
    public function ${relatedModel.toLowerCase()}()
    {
        return $this->belongsTo(${relatedModel}::class${methodParams});
    }`
        case "belongsToMany":
          const pivotParam = pivotTable ? `, '${pivotTable}'` : ""
          return `
    public function ${relatedModel.toLowerCase()}s()
    {
        return $this->belongsToMany(${relatedModel}::class${pivotParam}${methodParams});
    }`
        default:
          return ""
      }
    })
    .join("\n")

  // Add traits
  let useTraits = ""
  if (model.softDeletes) {
    useTraits = "use Illuminate\\Database\\Eloquent\\SoftDeletes;\n    "
  }

  // Add timestamps property
  let timestampsProperty = ""
  if (!model.timestamps) {
    timestampsProperty = "\n    public $timestamps = false;"
  }

  return `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
${model.softDeletes ? "use Illuminate\\Database\\Eloquent\\SoftDeletes;" : ""}

class ${model.name} extends Model
{
    use HasFactory;
    ${useTraits}
${tableName ? `\n    ${tableName}` : ""}${timestampsProperty}

    protected $fillable = [
${model.fields.map((field) => `        '${field.name}'`).join(",\n")}
    ];
${relationships}
}`
}

// Function to generate pivot table migration code
export function generatePivotTableCode(relationship) {
  const { models, pivotTable } = relationship
  const sortedModels = [...models].sort()
  const className = `Create${pivotTable
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}Table`

  return `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('${pivotTable}', function (Blueprint $table) {
            $table->id();
            $table->foreignId('${sortedModels[0].toLowerCase()}_id')->constrained()->onDelete('cascade');
            $table->foreignId('${sortedModels[1].toLowerCase()}_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Optional: Add unique constraint to prevent duplicate relationships
            $table->unique(['${sortedModels[0].toLowerCase()}_id', '${sortedModels[1].toLowerCase()}_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('${pivotTable}');
    }
};`
}
