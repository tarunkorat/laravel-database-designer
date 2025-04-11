"use client"

import { useRef, useEffect, useState } from "react"
import * as d3 from "d3"
import { Button } from "@/components/ui/button"
import { Download, ZoomIn, ZoomOut, RefreshCw, Maximize2, Minimize2 } from "lucide-react"

export function SchemaVisualizer({ models }) {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!models.length || !containerRef.current) return

    // Get container dimensions
    const containerRect = containerRef.current.getBoundingClientRect()
    const width = containerRect.width
    const height = containerRect.height

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [0, 0, width, height])

    // Create a group for the graph
    const g = svg.append("g")

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom)

    // Create nodes for each model
    const nodes = models.map((model, i) => ({
      id: model.id,
      name: model.name,
      fields: model.fields,
      relationships: model.relationships,
      x: 100 + (i % 3) * 300,
      y: 100 + Math.floor(i / 3) * 300,
    }))

    // Create links based on relationships
    const links = []
    models.forEach((model) => {
      model.relationships.forEach((rel) => {
        const targetModel = models.find((m) => m.name === rel.relatedModel)
        if (targetModel) {
          links.push({
            source: model.id,
            target: targetModel.id,
            type: rel.type,
            sourceField: rel.type === "belongsTo" ? rel.foreignKey || `${rel.relatedModel.toLowerCase()}_id` : "id",
            targetField: rel.type === "belongsTo" ? "id" : rel.foreignKey || `${model.name.toLowerCase()}_id`,
          })
        }
      })
    })

    // Add arrowhead marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#e11d48")

    // Draw nodes
    const node = g
      .append("g")
      .selectAll("rect")
      .data(nodes)
      .join("g")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))

    // Add model rectangles
    node
      .append("rect")
      .attr("width", 300)
      .attr("height", (d) => 50 + d.fields.length * 25)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("fill", "#131e2d")
      .attr("stroke", "#1e2a3b")
      .attr("stroke-width", 2)

    // Add model headers
    node.append("rect").attr("width", 300).attr("height", 40).attr("rx", 6).attr("ry", 6).attr("fill", "#1e2a3b")

    // Add model names
    node
      .append("text")
      .attr("x", 15)
      .attr("y", 25)
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .text((d) => d.name)

    // Add field rows
    node.each(function (d) {
      const g = d3.select(this)

      d.fields.forEach((field, i) => {
        // Field row background (alternating colors)
        g.append("rect")
          .attr("x", 0)
          .attr("y", 40 + i * 25)
          .attr("width", 300)
          .attr("height", 25)
          .attr("fill", i % 2 === 0 ? "#0a1120" : "#131e2d")
          .attr("data-field-id", field.id)

        // Field name
        g.append("text")
          .attr("x", 15)
          .attr("y", 40 + i * 25 + 17)
          .attr("fill", "#e2e8f0")
          .attr("font-size", "12px")
          .text(field.name)

        // Field type
        g.append("text")
          .attr("x", 150)
          .attr("y", 40 + i * 25 + 17)
          .attr("fill", "#94a3b8")
          .attr("font-size", "12px")
          .text(field.type)

        // Field attributes
        const attributes = []
        if (field.nullable) attributes.push("N")
        if (field.unique) attributes.push("U")
        if (field.index) attributes.push("I")

        g.append("text")
          .attr("x", 280)
          .attr("y", 40 + i * 25 + 17)
          .attr("text-anchor", "end")
          .attr("fill", "#64748b")
          .attr("font-size", "12px")
          .text(attributes.join(" "))
      })
    })

    // Draw links between fields
    const link = g
      .append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("d", (d) => {
        const sourceNode = nodes.find((n) => n.id === d.source)
        const targetNode = nodes.find((n) => n.id === d.target)

        // Find source field position
        const sourceFieldIndex = sourceNode.fields.findIndex(
          (f) => f.name === d.sourceField || (d.sourceField === "id" && f.name === "id"),
        )

        const sourceFieldY = sourceFieldIndex !== -1 ? 40 + sourceFieldIndex * 25 + 12.5 : 20 // Default to header if field not found

        // Find target field position
        const targetFieldIndex = targetNode.fields.findIndex(
          (f) => f.name === d.targetField || (d.targetField === "id" && f.name === "id"),
        )

        const targetFieldY = targetFieldIndex !== -1 ? 40 + targetFieldIndex * 25 + 12.5 : 20 // Default to header if field not found

        // Calculate path
        const sourceX = sourceNode.x + 300 // Right side of source
        const sourceY = sourceNode.y + sourceFieldY
        const targetX = targetNode.x // Left side of target
        const targetY = targetNode.y + targetFieldY

        // Create a curved path
        return `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`
      })
      .attr("fill", "none")
      .attr("stroke", "#e11d48")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrowhead)")
      .attr("opacity", 0.7)
      .attr("stroke-dasharray", (d) => (d.type.includes("morph") ? "5,5" : "none"))

    // Add relationship type labels
    g.append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .attr("x", (d) => {
        const sourceNode = nodes.find((n) => n.id === d.source)
        const targetNode = nodes.find((n) => n.id === d.target)
        return (sourceNode.x + 300 + targetNode.x) / 2
      })
      .attr("y", (d) => {
        const sourceNode = nodes.find((n) => n.id === d.source)
        const targetNode = nodes.find((n) => n.id === d.target)

        // Find source field position
        const sourceFieldIndex = sourceNode.fields.findIndex(
          (f) => f.name === d.sourceField || (d.sourceField === "id" && f.name === "id"),
        )

        const sourceFieldY = sourceFieldIndex !== -1 ? 40 + sourceFieldIndex * 25 + 12.5 : 20 // Default to header if field not found

        // Find target field position
        const targetFieldIndex = targetNode.fields.findIndex(
          (f) => f.name === d.targetField || (d.targetField === "id" && f.name === "id"),
        )

        const targetFieldY = targetFieldIndex !== -1 ? 40 + targetFieldIndex * 25 + 12.5 : 20 // Default to header if field not found

        return (sourceNode.y + sourceFieldY + targetNode.y + targetFieldY) / 2 - 10
      })
      .attr("fill", "#e11d48")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("background", "#0a1120")
      .text((d) => d.type)
      .each(function () {
        const text = d3.select(this)
        const bbox = text.node().getBBox()

        text
          .insert("rect", "text")
          .attr("x", bbox.x - 3)
          .attr("y", bbox.y - 1)
          .attr("width", bbox.width + 6)
          .attr("height", bbox.height + 2)
          .attr("fill", "#0a1120")
          .attr("rx", 2)
      })

    // Drag functions
    function dragstarted(event, d) {
      d3.select(this).raise().attr("stroke", "#e11d48")
    }

    function dragged(event, d) {
      d.x = event.x
      d.y = event.y
      d3.select(this).attr("transform", `translate(${d.x}, ${d.y})`)

      // Update links
      link.attr("d", (l) => {
        const sourceNode = nodes.find((n) => n.id === l.source)
        const targetNode = nodes.find((n) => n.id === l.target)

        // Find source field position
        const sourceFieldIndex = sourceNode.fields.findIndex(
          (f) => f.name === l.sourceField || (l.sourceField === "id" && f.name === "id"),
        )

        const sourceFieldY = sourceFieldIndex !== -1 ? 40 + sourceFieldIndex * 25 + 12.5 : 20 // Default to header if field not found

        // Find target field position
        const targetFieldIndex = targetNode.fields.findIndex(
          (f) => f.name === l.targetField || (l.targetField === "id" && f.name === "id"),
        )

        const targetFieldY = targetFieldIndex !== -1 ? 40 + targetFieldIndex * 25 + 12.5 : 20 // Default to header if field not found

        // Calculate path
        const sourceX = sourceNode.x + 300 // Right side of source
        const sourceY = sourceNode.y + sourceFieldY
        const targetX = targetNode.x // Left side of target
        const targetY = targetNode.y + targetFieldY

        // Create a curved path
        return `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`
      })

      // Update relationship labels
      d3.selectAll("text")
        .filter(function () {
          return (
            d3.select(this).text() === "hasOne" ||
            d3.select(this).text() === "hasMany" ||
            d3.select(this).text() === "belongsTo" ||
            d3.select(this).text() === "belongsToMany" ||
            d3.select(this).text() === "hasManyThrough" ||
            d3.select(this).text() === "hasOneThrough" ||
            d3.select(this).text() === "morphOne" ||
            d3.select(this).text() === "morphMany" ||
            d3.select(this).text() === "morphTo" ||
            d3.select(this).text() === "morphToMany" ||
            d3.select(this).text() === "morphedByMany"
          )
        })
        .each(function (d) {
          if (!d) return

          const sourceNode = nodes.find((n) => n.id === d.source)
          const targetNode = nodes.find((n) => n.id === d.target)

          if (!sourceNode || !targetNode) return

          // Find source field position
          const sourceFieldIndex = sourceNode.fields.findIndex(
            (f) => f.name === d.sourceField || (d.sourceField === "id" && f.name === "id"),
          )

          const sourceFieldY = sourceFieldIndex !== -1 ? 40 + sourceFieldIndex * 25 + 12.5 : 20 // Default to header if field not found

          // Find target field position
          const targetFieldIndex = targetNode.fields.findIndex(
            (f) => f.name === d.targetField || (d.targetField === "id" && f.name === "id"),
          )

          const targetFieldY = targetFieldIndex !== -1 ? 40 + targetFieldIndex * 25 + 12.5 : 20 // Default to header if field not found

          d3.select(this)
            .attr("x", (sourceNode.x + 300 + targetNode.x) / 2)
            .attr("y", (sourceNode.y + sourceFieldY + targetNode.y + targetFieldY) / 2 - 10)
        })
    }

    function dragended(event, d) {
      d3.select(this).attr("stroke", null)
    }

    // Initial zoom to fit
    const initialTransform = d3.zoomIdentity.scale(0.8).translate(width / 4, height / 8)
    svg.call(zoom.transform, initialTransform)
  }, [models])

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current)
    const zoom = d3.zoom().on("zoom", (event) => {
      svg.select("g").attr("transform", event.transform)
    })

    svg.transition().call(zoom.scaleBy, 1.2)
  }

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current)
    const zoom = d3.zoom().on("zoom", (event) => {
      svg.select("g").attr("transform", event.transform)
    })

    svg.transition().call(zoom.scaleBy, 0.8)
  }

  const handleReset = () => {
    const svg = d3.select(svgRef.current)
    const zoom = d3.zoom().on("zoom", (event) => {
      svg.select("g").attr("transform", event.transform)
    })

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const width = containerRect.width
      const height = containerRect.height
      const initialTransform = d3.zoomIdentity.scale(0.8).translate(width / 4, height / 8)
      svg.transition().call(zoom.transform, initialTransform)
    }
  }

  const handleDownloadSVG = () => {
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    const downloadLink = document.createElement("a")
    downloadLink.href = svgUrl
    downloadLink.download = "database-schema.svg"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-[#0a1120] p-4" : "h-full"}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Database Schema Visualization</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn} className="border-[#1e2a3b] bg-[#131e2d]">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut} className="border-[#1e2a3b] bg-[#131e2d]">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="border-[#1e2a3b] bg-[#131e2d]">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen} className="border-[#1e2a3b] bg-[#131e2d]">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadSVG} className="border-[#1e2a3b] bg-[#131e2d]">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {models.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border border-dashed border-[#1e2a3b] rounded-lg">
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">No Models to Visualize</h3>
            <p className="text-gray-400">Add some models to see your database schema visualization.</p>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="flex-1 border border-[#1e2a3b] rounded-lg overflow-hidden bg-[#0a1120]">
          <svg ref={svgRef} width="100%" height="100%" />
        </div>
      )}
    </div>
  )
}
